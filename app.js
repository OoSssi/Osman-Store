const products = [
  {
    id: "defter",
    name: "Çizgili defter",
    blurb: "A5, 80 yaprak. Ders notu için.",
    price: 89,
    category: "kirtasiye",
    color: "#f3d2b3",
    icon: "book"
  },
  {
    id: "kalem",
    name: "Jel kalem seti",
    blurb: "Siyah, mavi, kırmızı. Üçlü paket.",
    price: 64,
    category: "kirtasiye",
    color: "#d7e4d4",
    icon: "pen"
  },
  {
    id: "canta",
    name: "Bez çanta",
    blurb: "Kitap ve matara sığar.",
    price: 149,
    category: "gunluk",
    color: "#ead9c4",
    icon: "bag"
  },
  {
    id: "lamba",
    name: "Masa lambası",
    blurb: "Sıcak ışık, gece çalışması için.",
    price: 320,
    category: "gunluk",
    color: "#f6e3a1",
    icon: "lamp"
  },
  {
    id: "termos",
    name: "Termos",
    blurb: "350 ml. Çay derste soğumasın.",
    price: 210,
    category: "gunluk",
    color: "#d5e2ef",
    icon: "cup"
  },
  {
    id: "kulaklik",
    name: "Kulaklık",
    blurb: "Kablolu. Kütüphane sessizliği.",
    price: 450,
    category: "teknoloji",
    color: "#e7d5ea",
    icon: "headphones"
  }
];

const icons = {
  book: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M14 16h16a8 8 0 0 1 8 8v26H22a8 8 0 0 0-8 8V16z"/><path d="M50 16H34a8 8 0 0 0-8 8v26h16a8 8 0 0 1 8 8V16z"/></svg>',
  pen: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M40 12l12 12-26 26H14V38L40 12z"/><path d="M36 16l12 12"/></svg>',
  bag: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M18 24h28l-2 28H20L18 24z"/><path d="M24 24v-4a8 8 0 0 1 16 0v4"/></svg>',
  lamp: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M22 18h20l6 16H16l6-16z"/><path d="M32 34v12"/><path d="M22 50h20"/></svg>',
  cup: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M20 18h22v22a10 10 0 0 1-10 10h-2a10 10 0 0 1-10-10V18z"/><path d="M42 24h6a6 6 0 0 1 0 12h-6"/><path d="M26 12c0 4 4 4 4 8M34 12c0 4 4 4 4 8"/></svg>',
  headphones: '<svg viewBox="0 0 64 64" fill="none" stroke="#1e1a16" stroke-width="2.4"><path d="M14 34v8a6 6 0 0 0 6 6h4V30h-4a6 6 0 0 0-6 4zM50 34v8a6 6 0 0 1-6 6h-4V30h4a6 6 0 0 1 6 4z"/><path d="M18 32a14 14 0 0 1 28 0"/></svg>'
};

const money = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0
});

const grid = document.querySelector("#grid");
const empty = document.querySelector("#empty");
const countEl = document.querySelector("#cart-count");
const linesEl = document.querySelector("#lines");
const drawerEmpty = document.querySelector("#drawer-empty");
const totalEl = document.querySelector("#total");
const drawer = document.querySelector("#drawer");
const shade = document.querySelector("#shade");
const note = document.querySelector("#note");
const checkout = document.querySelector("#checkout");

let filter = "hepsi";
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("osman-store-cart") || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("osman-store-cart", JSON.stringify(cart));
}

function renderProducts() {
  const list = products.filter((item) => filter === "hepsi" || item.category === filter);
  empty.hidden = list.length > 0;
  grid.innerHTML = list.map((item) => `
    <article class="card">
      <div class="swatch" style="background:${item.color}">${icons[item.icon]}</div>
      <h2>${item.name}</h2>
      <p>${item.blurb}</p>
      <div class="price-row">
        <span class="price">${money.format(item.price)}</span>
        <button class="add" type="button" data-add="${item.id}">Sepete ekle</button>
      </div>
    </article>
  `).join("");
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return products.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
}

function renderCart() {
  const entries = products.filter((item) => cart[item.id]);
  countEl.textContent = String(cartCount());
  drawerEmpty.hidden = entries.length > 0;
  linesEl.hidden = entries.length === 0;
  checkout.disabled = entries.length === 0;
  totalEl.textContent = money.format(cartTotal());
  linesEl.innerHTML = entries.map((item) => `
    <li class="line">
      <div>
        <strong>${item.name}</strong>
        <div>${money.format(item.price)}</div>
      </div>
      <div class="qty">
        <button type="button" data-dec="${item.id}" aria-label="${item.name} azalt">−</button>
        <span>${cart[item.id]}</span>
        <button type="button" data-inc="${item.id}" aria-label="${item.name} artır">+</button>
      </div>
    </li>
  `).join("");
}

function openCart() {
  note.hidden = true;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  shade.hidden = false;
}

function closeCart() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  shade.hidden = true;
}

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("is-on", chip === button);
  });
  renderProducts();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
});

linesEl.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");
  if (inc) cart[inc.dataset.inc] += 1;
  if (dec) {
    const id = dec.dataset.dec;
    cart[id] -= 1;
    if (cart[id] <= 0) delete cart[id];
  }
  if (!inc && !dec) return;
  saveCart();
  renderCart();
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
shade.addEventListener("click", closeCart);

checkout.addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
  note.hidden = false;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
