/* =========================================================
   KOSTRA Authentication
   Static / LocalStorage Version
========================================================= */

function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem("nemu_users") ||
            "[]"
        );
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(
        "nemu_users",
        JSON.stringify(users)
    );
}

/* =========================================================
   REGISTER
========================================================= */

function registerUser(event) {

    event.preventDefault();

    const form =
        document.getElementById("registerForm");

    const message =
        document.getElementById("registerMessage");

    if (!form || !message) {
        return;
    }

    const formData =
        new FormData(form);

    const username =
        String(
            formData.get("username") || ""
        ).trim();

    const email =
        String(
            formData.get("email") || ""
        ).trim()
        .toLowerCase();

    const password =
        String(
            formData.get("password") || ""
        );

    const confirmPassword =
        String(
            formData.get("confirmPassword") || ""
        );

    if (
        !username ||
        !email ||
        !password
    ) {

        message.textContent =
            "Semua field wajib diisi.";

        return;
    }

    if (password.length < 6) {

        message.textContent =
            "Password minimal 6 karakter.";

        return;
    }

    if (
        password !== confirmPassword
    ) {

        message.textContent =
            "Konfirmasi password tidak sama.";

        return;
    }

    const users =
        getUsers();

    const exists =
        users.some(
            (user) =>
                user.email === email ||
                user.username.toLowerCase() ===
                    username.toLowerCase()
        );

    if (exists) {

        message.textContent =
            "Email atau username sudah terdaftar.";

        return;
    }

    users.push({
        id: Date.now(),
        username,
        email,
        password
    });

    saveUsers(users);

    message.textContent =
        "Registrasi berhasil ✓ Mengarahkan ke login...";

    form.reset();

    setTimeout(() => {
        window.location.href =
            "/login.html";
    }, 900);
}

/* =========================================================
   LOGIN
========================================================= */

function loginUser(event) {

    event.preventDefault();

    const form =
        document.getElementById("loginForm");

    const message =
        document.getElementById("loginMessage");

    if (!form || !message) {
        return;
    }

    const formData =
        new FormData(form);

    const identity =
        String(
            formData.get("identity") || ""
        )
        .trim()
        .toLowerCase();

    const password =
        String(
            formData.get("password") || ""
        );

    /* Demo account */

    if (
        identity === "demo" &&
        password === "demo"
    ) {

        localStorage.setItem(
            "nemu_user",
            JSON.stringify({
                username: "Demo User",
                email: "demo@nemukos.id"
            })
        );

        window.location.href =
            "/";

        return;
    }

    const users =
        getUsers();

    const user =
        users.find(
            (item) =>
                (
                    item.email.toLowerCase() ===
                        identity ||
                    item.username.toLowerCase() ===
                        identity
                ) &&
                item.password === password
        );

    if (!user) {

        message.textContent =
            "Email/username atau password salah.";

        return;
    }

    localStorage.setItem(
        "nemu_user",
        JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email
        })
    );

    message.textContent =
        "Login berhasil ✓";

    setTimeout(() => {
        window.location.href =
            "/";
    }, 500);
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

function forgotPassword(event) {

    event.preventDefault();

    const form =
        document.getElementById(
            "forgotPasswordForm"
        );

    const message =
        document.getElementById(
            "forgotMessage"
        );

    if (!form || !message) {
        return;
    }

    const formData =
        new FormData(form);

    const email =
        String(
            formData.get("email") || ""
        )
        .trim()
        .toLowerCase();

    if (!email) {

        message.textContent =
            "Masukkan email terlebih dahulu.";

        return;
    }

    const users =
        getUsers();

    const exists =
        users.some(
            (user) =>
                user.email.toLowerCase() ===
                email
        );

    if (!exists) {

        message.textContent =
            "Email belum terdaftar.";

        return;
    }

    localStorage.setItem(
        "nemu_reset_email",
        email
    );

    message.textContent =
        "Link reset password demo berhasil dibuat ✓";

    setTimeout(() => {
        window.location.href =
            "/reset-password.html";
    }, 900);
}

/* =========================================================
   RESET PASSWORD
========================================================= */

function resetPassword(event) {

    event.preventDefault();

    const form =
        document.getElementById(
            "resetPasswordForm"
        );

    const message =
        document.getElementById(
            "resetMessage"
        );

    if (!form || !message) {
        return;
    }

    const formData =
        new FormData(form);

    const password =
        String(
            formData.get("password") || ""
        );

    const confirmPassword =
        String(
            formData.get("confirmPassword") || ""
        );

    if (password.length < 6) {

        message.textContent =
            "Password minimal 6 karakter.";

        return;
    }

    if (
        password !== confirmPassword
    ) {

        message.textContent =
            "Konfirmasi password tidak sama.";

        return;
    }

    const email =
        localStorage.getItem(
            "nemu_reset_email"
        );

    if (!email) {

        message.textContent =
            "Sesi reset password tidak ditemukan.";

        return;
    }

    const users =
        getUsers();

    const index =
        users.findIndex(
            (user) =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (index === -1) {

        message.textContent =
            "Akun tidak ditemukan.";

        return;
    }

    users[index].password =
        password;

    saveUsers(users);

    localStorage.removeItem(
        "nemu_reset_email"
    );

    message.textContent =
        "Password berhasil diubah ✓";

    setTimeout(() => {
        window.location.href =
            "/login.html";
    }, 900);
}

/* =========================================================
   AUTO CONNECT FORM
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        const forgotForm =
            document.getElementById(
                "forgotPasswordForm"
            );

        const resetForm =
            document.getElementById(
                "resetPasswordForm"
            );

        if (loginForm) {
            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }

        if (registerForm) {
            registerForm.addEventListener(
                "submit",
                registerUser
            );
        }

        if (forgotForm) {
            forgotForm.addEventListener(
                "submit",
                forgotPassword
            );
        }

        if (resetForm) {
            resetForm.addEventListener(
                "submit",
                resetPassword
            );
        }
    }
);
