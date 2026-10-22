const navLinks = document.getElementById("navLinks");

    const menuToggle = document.getElementById("menuToggle");

    const cartPanel = document.getElementById("cartPanel");

    const cartCount = document.getElementById("cartCount");

    const cartItems = document.getElementById("cartItems");

    const cartTotal = document.getElementById("cartTotal");

    const toast = document.getElementById("toast");

    // Replace with the restaurant's real WhatsApp number.

    // Use the country code and digits only, without + or spaces.

    const RESTAURANT_WHATSAPP = "2348065938348";

    const cart = [];

    const money = amount =>

      "₦" + amount.toLocaleString("en-NG");

    let toastTimeout;

    function showToast(message) {

      toast.textContent = message;

      toast.classList.add("show");

      clearTimeout(toastTimeout);

      toastTimeout = setTimeout(

        () => toast.classList.remove("show"), 2600

      );

    }

    // Mobile navigation

    menuToggle.addEventListener("click", () => {

      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.textContent = isOpen ? "✕" : "☰";

    });

    navLinks.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

      });

    });

    // Menu filters

    document.querySelectorAll(".filter-btn").forEach(button => {

      button.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn").forEach(item => {

          item.classList.remove("active");

        });

        button.classList.add("active");

        const category = button.dataset.filter;

        let visibleCount = 0;

        document.querySelectorAll(".food-card").forEach(card => {

          const show =

            category === "all" ||

            card.dataset.category === category;

          card.hidden = !show;

          if (show) visibleCount++;

        });

        const existingMessage = document.querySelector(".empty-menu");

        if (existingMessage) existingMessage.remove();

        if (!visibleCount) {

          const message = document.createElement("p");

          message.className = "empty-menu";

          message.textContent = "No dishes available in this category yet.";

          document.getElementById("menuGrid").appendChild(message);

        }

      });

    });

    // Shopping cart

    function renderCart() {

      cartItems.replaceChildren();

      if (!cart.length) {

        const message = document.createElement("p");

        message.textContent = "Your cart is empty.";

        message.style.color = "var(--muted)";

        cartItems.appendChild(message);

      }

      let total = 0;

      let count = 0;

      cart.forEach((item, index) => {

        total += item.price * item.quantity;

        count += item.quantity;

        const row = document.createElement("div");

        row.className = "cart-row";

        const details = document.createElement("span");

        details.textContent =

          `${item.name} × ${item.quantity} — ${money(item.price * item.quantity)}`;

        const remove = document.createElement("button");

        remove.type = "button";

        remove.textContent = "Remove";

        remove.setAttribute("aria-label", `Remove ${item.name}`);

        remove.addEventListener("click", () => {

          cart.splice(index, 1);

          renderCart();

        });

        row.append(details, remove);

        cartItems.appendChild(row);

      });

      cartCount.textContent = count;

      cartTotal.textContent = money(total);

    }

    document.querySelectorAll(".add-to-cart").forEach(button => {

      button.addEventListener("click", () => {

        const card = button.closest(".food-card");

        const name = card.dataset.name;

        const price = Number(card.dataset.price);

        const existing = cart.find(item => item.name === name);

        if (existing) {

          existing.quantity++;

        } else {

          cart.push({ name, price, quantity: 1 });

        }

        renderCart();

        showToast(`${name} added to your cart.`);

      });

    });

    document.getElementById("cartToggle").addEventListener("click", () => {

      cartPanel.hidden = !cartPanel.hidden;

    });

    document.getElementById("cartClose").addEventListener("click", () => {

      cartPanel.hidden = true;

    });

    document.getElementById("checkoutBtn").addEventListener("click", () => {

      if (!cart.length) {

        showToast("Please add a dish to your cart first.");

        return;

      }

      const total = cart.reduce(

        (sum, item) => sum + item.price * item.quantity, 0

      );

      const lines = cart.map(item =>

        `${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`

      );

      const message = [

        "Hello Ryo Restaurant! I'd like to place an order:",

        "",

        ...lines,

        "",

        `Total: ${money(total)}`,

        "",

        "Please confirm availability and delivery/pickup details."

      ].join("\n");

      if (!/^\d{10,15}$/.test(RESTAURANT_WHATSAPP)) {

        showToast("Please configure the restaurant's WhatsApp number in the code.");

        return;

      }

      const url = "https://wa.me/" + RESTAURANT_WHATSAPP +

        "?text=" + encodeURIComponent(message);

      window.open(url, "_blank", "noopener,noreferrer");

    });

    // Reservation form

    const bookingDate = document.getElementById("bookingDate");

    const today = new Date();

    const localToday = [

      today.getFullYear(),

      String(today.getMonth() + 1).padStart(2, "0"),

      String(today.getDate()).padStart(2, "0")

    ].join("-");

    bookingDate.min = localToday;

    document.getElementById("reservationForm").addEventListener(

      "submit", event => {

        event.preventDefault();

        const form = event.currentTarget;

        if (!form.reportValidity()) return;

        const data = new FormData(form);

        const message = [

          "Hello Ryo Restaurant! I'd like to request a table reservation.",

          "",

          `Name: ${data.get("name")}`,

          `Email: ${data.get("email")}`,

          `Date: ${data.get("date")}`,

          `Time: ${data.get("time")}`,

          `Guests: ${data.get("guests")}`,

          `Special requests: ${data.get("notes") || "None"}`,

          "",

          "Please confirm my reservation."

        ].join("\n");

        if (!/^\d{10,15}$/.test(RESTAURANT_WHATSAPP)) {

          showToast("Please configure the restaurant's WhatsApp number in the code.");

          return;

        }

        const url = "https://wa.me/" + RESTAURANT_WHATSAPP +

          "?text=" + encodeURIComponent(message);

        window.open(url, "_blank", "noopener,noreferrer");

        showToast("Your request is ready in WhatsApp. Send it to complete the request.");

      }

    );

    document.getElementById("year").textContent =

      new Date().getFullYear();

    renderCart();
