'use client'

import { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface RunnableCodeBlockProps {
  children: string
  className?: string
}

// Global state for Pyodide to avoid conflicts between multiple instances
let globalPyodideReady = false
let globalPyodideLoading = false

declare global {
  interface Window {
    loadPyodide: any
    pyodide: any
  }
}

export default function RunnableCodeBlock({ children, className }: RunnableCodeBlockProps) {
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [pyodideReady, setPyodideReady] = useState(false)
  const [error, setError] = useState<string>('')
  const [componentId] = useState(() => Math.random().toString(36).substr(2, 9))
  const [copied, setCopied] = useState(false)

  // Check if this is a Python code block
  const isPython = className?.includes('language-python') || className?.includes('python')

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

      useEffect(() => {
    if (isPython) {
      // Reset states when navigating to a new page
      setOutput('')
      setError('')
      setIsRunning(false)

      // Check global Pyodide state
      if (globalPyodideReady && window.pyodide && typeof window.pyodide.runPython === 'function') {
        setPyodideReady(true)
      } else if (globalPyodideLoading) {
        // Another instance is loading, wait for it
        const checkInterval = setInterval(() => {
          if (globalPyodideReady && window.pyodide) {
            setPyodideReady(true)
            clearInterval(checkInterval)
          }
        }, 100)

        // Cleanup interval after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000)
      } else {
        setPyodideReady(false)
        loadPyodide()
      }
    }

    // Cleanup function to reset state when component unmounts
    return () => {
      if (!isPython) return
      setOutput('')
      setError('')
      setIsRunning(false)
    }
  }, [isPython])

    const loadPyodide = async () => {
    if (globalPyodideLoading) return // Already loading

    try {
      globalPyodideLoading = true

      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"]')

      if (!window.loadPyodide && !existingScript) {
        // Load Pyodide script
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        script.onload = async () => {
          try {
            window.pyodide = await window.loadPyodide()
            globalPyodideReady = true
            globalPyodideLoading = false
            setPyodideReady(true)
          } catch (err) {
            globalPyodideLoading = false
            setError('Failed to initialize Pyodide')
            console.error('Failed to initialize Pyodide:', err)
          }
        }
        script.onerror = () => {
          globalPyodideLoading = false
          setError('Failed to load Pyodide script')
        }
        document.head.appendChild(script)
      } else if (window.loadPyodide && !window.pyodide) {
        // Script loaded but Pyodide not initialized
        window.pyodide = await window.loadPyodide()
        globalPyodideReady = true
        globalPyodideLoading = false
        setPyodideReady(true)
      } else if (window.pyodide) {
        // Already ready
        globalPyodideReady = true
        globalPyodideLoading = false
        setPyodideReady(true)
      }
    } catch (err) {
      globalPyodideLoading = false
      setError('Failed to load Pyodide')
      console.error('Failed to load Pyodide:', err)
    }
  }

  const runCode = async () => {
    if (!window.pyodide || !pyodideReady) {
      setError('Pyodide not ready')
      return
    }

    setIsRunning(true)
    setError('')
    setOutput('')

    try {
      // Install common packages if they're used in the code
      const codeText = children.toLowerCase()
      const packagesToInstall = []

      if (codeText.includes('matplotlib') || codeText.includes('plt.')) {
        packagesToInstall.push('matplotlib')
      }
      if (codeText.includes('numpy') || codeText.includes('np.')) {
        packagesToInstall.push('numpy')
      }
      if (codeText.includes('pandas') || codeText.includes('pd.')) {
        packagesToInstall.push('pandas')
      }
      if (codeText.includes('yfinance') || codeText.includes('yf.')) {
        packagesToInstall.push('yfinance')
      }

      // Install packages if needed
      if (packagesToInstall.length > 0) {
        setOutput('Installing required packages...')
        for (const pkg of packagesToInstall) {
          try {
            await window.pyodide.loadPackage(pkg)
          } catch (e) {
            // If loadPackage fails, try micropip
            try {
              await window.pyodide.loadPackage('micropip')
            } catch (micropipError) {
              // micropip should be available by default, but just in case
            }
            try {
              await window.pyodide.runPythonAsync(`
import micropip
await micropip.install('${pkg}', keep_going=True)
              `)
            } catch (installError) {
              console.warn(`Failed to install ${pkg}:`, installError)
              setOutput(prev => prev + `\nWarning: Could not install ${pkg}. Some packages with compiled dependencies are not available in Pyodide.\nTry using alternative packages or mock data for demonstration.`)
            }
          }
        }
        setOutput('Packages installed. Running code...')
      }

            // Setup matplotlib backend and capture stdout with unique scope
      const setupCode = `
import sys
from io import StringIO
import base64

# Setup matplotlib for web
try:
    import matplotlib
    matplotlib.use('Agg')  # Use non-interactive backend
except:
    pass

# Create unique namespace for this execution
exec_namespace_${componentId} = {}
stdout_${componentId} = StringIO()
plot_data_${componentId} = None

def capture_plot_${componentId}():
    global plot_data_${componentId}
    try:
        import matplotlib.pyplot as plt
        from io import BytesIO

        # Save current figure to bytes
        buf = BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight',
                   facecolor='white', edgecolor='none')
        buf.seek(0)

        # Convert to base64
        import base64
        plot_data_${componentId} = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()
        plt.close('all')  # Close figures to free memory

        return True
    except Exception as e:
        print(f"Error capturing plot: {e}")
        return False

# Redirect stdout for this execution
old_stdout = sys.stdout
sys.stdout = stdout_${componentId}
      `

      window.pyodide.runPython(setupCode)

                  // Run the user code (replace plt.show() with capture_plot())
      let modifiedCode = children.replace(/plt\.show\(\)/g, `capture_plot_${componentId}()`)

      // Execute the user code directly (error handling in JavaScript)
      window.pyodide.runPython(modifiedCode)

      // Get the output and any plots for this specific component
      const stdout = window.pyodide.runPython(`stdout_${componentId}.getvalue()`)
      const plotData = window.pyodide.runPython(`plot_data_${componentId}`)

      let output = stdout || 'Code executed successfully'

      // If we have plot data, add it to output
      if (plotData) {
        output += `\n\nGenerated Plot:\n<img src="data:image/png;base64,${plotData}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />`
      }

      setOutput(output)

      // Reset stdout and cleanup for this component
      window.pyodide.runPython(`
sys.stdout = old_stdout
# Clean up component-specific variables
try:
    del stdout_${componentId}
    del plot_data_${componentId}
    del exec_namespace_${componentId}
except:
    pass
      `)
          } catch (err: any) {
        setError(err.message || 'An error occurred while running the code')

        // Ensure cleanup even on error
        try {
          window.pyodide.runPython(`
sys.stdout = old_stdout if 'old_stdout' in locals() else sys.__stdout__
# Clean up component-specific variables
try:
    del stdout_${componentId}
    del plot_data_${componentId}
    del exec_namespace_${componentId}
except:
    pass
          `)
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError)
        }
      } finally {
        setIsRunning(false)
      }
  }

  if (!isPython) {
    // Regular code block for non-Python code with syntax highlighting
    const language = className?.replace('language-', '') || 'text'
    return (
      <div className="code-block-container">
        <div className="code-header">
          <span className="language-label">{language}</span>
          <button
            onClick={copyToClipboard}
            className="copy-button"
            title="Copy code"
          >
            {copied ? '✓ copied' : '⧉'}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            fontSize: '0.9rem'
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <div className="runnable-code-block">
      <div className="code-header">
        <span className="language-label">Python</span>
        <div className="button-group">
          <button
            onClick={copyToClipboard}
            className="copy-button"
            title="Copy code"
          >
            {copied ? '✓ copied' : '⧉'}
          </button>
          <button
            onClick={runCode}
            disabled={!pyodideReady || isRunning}
            className="run-button"
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language="python"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.9rem',
          backgroundColor: '#2a2a2a'
        }}
      >
        {children}
      </SyntaxHighlighter>
      {(output || error) && (
        <div className="code-output">
          <div className="output-header">Output:</div>
          {(output && output.includes('<img')) ? (
            <div
              className={error ? 'error-output' : 'success-output'}
              dangerouslySetInnerHTML={{ __html: output.replace(/\n/g, '<br>') }}
            />
          ) : (
            <pre className={error ? 'error-output' : 'success-output'}>
              {error || output}
            </pre>
          )}
        </div>
      )}
      {!pyodideReady && isPython && (
        <div className="loading-message">Loading Python environment...</div>
      )}
    </div>
  )
}