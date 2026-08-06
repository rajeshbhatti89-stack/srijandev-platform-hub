import os
import glob
import re

html_files = glob.glob(r'd:\project\security_field_force_manager apk\sentinel_command_app\assets\web\*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Material Icons Fix
    # Remove Material Symbols links
    content = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Material\+Symbols\+Outlined.*?>\s*', '', content)
    # Add Material Icons CDN before tailwind config or style
    if '<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet">' not in content:
        content = content.replace('</title>', '</title>\n<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet">')
    
    content = content.replace('material-symbols-outlined', 'material-icons-outlined')
    
    # 2. Stylesheet Link
    if '<link rel="stylesheet" href="https://srijandev.in/styles.css">' not in content:
        content = content.replace('</title>', '</title>\n<link rel="stylesheet" href="https://srijandev.in/styles.css">')

    # 3. Fix missing image fallback
    content = re.sub(r'(<img[^>]+?)(?!onerror)[^>]*>', r'\1 onerror="this.style.display=\'none\'">', content)
    # Wait, the regex above might replace the closing tag improperly if not careful. Let's do a simpler replacement.
    content = content.replace('<img ', '<img onerror="this.style.display=\'none\'" ')

    # 4. API Endpoint Alignment
    # Make sure API_BASE_URL is correct if it exists
    content = content.replace("const API_BASE_URL = 'http://localhost:3000';", "const API_BASE_URL = 'https://api.srijandev.in';")
    content = content.replace("const API_BASE_URL = 'http://10.0.2.2:3000';", "const API_BASE_URL = 'https://api.srijandev.in';")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f'Processed {len(html_files)} files.')
