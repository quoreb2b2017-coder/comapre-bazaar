# Decodo + Proxifier fix — compare-bazaar.com

Site code mein koi proxy block **nahi** hai. Fix **aapke PC par Proxifier setup** mein karna hai.

## Quick fix (5 steps)

### 1. Sab band karo
- Browser VPN extensions off
- Windows VPN off
- Doosra proxy tool band

### 2. Proxifier profile import karo
```
Proxifier → File → Import Profile
→ cc-final/scripts/proxy/compare-bazaar.proxifier.ppx
```

### 3. Decodo credentials daalo
```
Proxifier → Profile → Proxy Servers → Decodo (gate.decodo.com:7000)
→ Username: Decodo dashboard se
→ Password: Decodo dashboard se
→ Check (test) → OK hona chahiye
```

**Important (Decodo docs):**
- Residential/Mobile SOCKS5: `gate.decodo.com:7000`
- Protocol Proxifier mein: **HTTPS** (HTTP proxy with SSL tunnel)
- Agar fail ho to **SOCKS5** try karo same host/port par

### 4. DNS fix (bahut important)
```
Proxifier → Profile → Name Resolution
→ ✅ Resolve through proxy
```

Iske bina `compare-bazaar.com` resolve nahi hota aur site blank / timeout dikhti hai.

### 5. Browser restart
```
https://www.compare-bazaar.com
```

---

## Test script (optional)

PowerShell mein:
```powershell
cd C:\Users\gafru\Desktop\cc-final
$env:DECODO_USER = "your_username"
$env:DECODO_PASS = "your_password"
.\scripts\proxy\test-decodo-proxy.ps1
```

---

## Agar ab bhi nahi khule

| Proxifier Log error | Fix |
|---------------------|-----|
| `407` | Username/password galat |
| `Timeout` | Decodo mein **Residential US** proxy select karo |
| `Name resolution failed` | Step 4 (DNS through proxy) ON karo |
| Kuch log mein nahi | Browser rule missing — profile dubara import karo |

Decodo dashboard: https://help.decodo.com/docs/proxifier-integration

---

## Rules is profile mein kya hai

1. **localhost** → Direct (dev server ke liye)
2. **chrome.exe, msedge.exe, firefox.exe** → Decodo proxy
3. Baaki sab → Direct
