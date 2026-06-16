# Damascus UI shell rcfile — sourced for the in-app terminal only.
# Keeps the user's normal environment, then overrides the prompt to a short path + $.

# We launch bash as non-login (--rcfile), so /etc/profile isn't read and the system
# PATH (/usr/bin, /bin, ...) is missing — `ls`, `clear`, etc. would be "command not
# found". Source the system profile to restore it, then guarantee the core dirs.
if [ -f /etc/profile ]; then
    . /etc/profile
fi
for d in /usr/local/sbin /usr/local/bin /usr/bin /usr/sbin /bin /sbin; do
    case ":$PATH:" in
        *":$d:"*) ;;
        *) PATH="$PATH:$d" ;;
    esac
done
export PATH

if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
fi

# Damascus prompt: short cwd (basename) in theme cyan, then $  — no user@host here
# (user@host is shown as a label above the terminal tabs in the UI).
PS1='\[\e[36m\]\W\[\e[0m\] \$ '
