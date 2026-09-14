import re

with open("src/components/SettingsModal.tsx", "r") as f:
    content = f.read()

search = """                   if (window.confirm("Are you ABSOLUTELY sure you want to reset everything? This cannot be undone!")) {
                     localStorage.clear();
                     window.location.reload();
                   }"""

replace = """                   if (window.confirm("Are you ABSOLUTELY sure you want to reset everything? This cannot be undone!")) {
                     localStorage.clear();
                     sessionStorage.clear();
                     const cookies = document.cookie.split(";");
                     for (let i = 0; i < cookies.length; i++) {
                         const cookie = cookies[i];
                         const eqPos = cookie.indexOf("=");
                         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                     }
                     window.location.href = window.location.origin + window.location.pathname;
                   }"""

content = content.replace(search, replace)

with open("src/components/SettingsModal.tsx", "w") as f:
    f.write(content)
