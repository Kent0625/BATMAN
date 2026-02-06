import webbrowser
import http.server
import socketserver
import os

# Configuration
PORT = 5500
DIRECTORY = "."
URL = f"http://127.0.0.1:{PORT}/index.html"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Setup the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🦇 WAYNE SECURITY TERMINAL ONLINE: {URL}")
    print(">> Press Ctrl+C to stop the server.")
    
    # This line opens the browser automatically
    webbrowser.open(URL)
    
    # Start the server
    httpd.serve_forever()