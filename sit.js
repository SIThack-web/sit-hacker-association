
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// メニューボタンを押したら開閉する
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く"
    );
});

// メニュー内のリンクを押したらメニューを閉じる
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "メニューを開く");
    });
});

/* ===== Interactive Events Calendar ===== */

const calendarDays = document.getElementById("calendar-days");
const calendarMonth = document.getElementById("calendar-month");
const selectedDateText = document.getElementById("selected-date");
const eventDetails = document.getElementById("event-details");
const upcomingList = document.getElementById("upcoming-list");

if (
  calendarDays &&
  calendarMonth &&
  selectedDateText &&
  eventDetails &&
  upcomingList
) {
  // イベント情報はここに追加していく
  const events = [
    {
      date: "2026-10-23",
      category: "CTF / ONLINE",
      title: "CREST CTF 2.0",
      description:
        "セキュリティの問題に挑戦するCTFイベント。参加方法や開催情報を公式ページで確認しよう。",
      url: "https://ctftime.org/",
      linkText: "CTFtimeで確認する",
      featured: false
    },
    {
      date: "2026-10-29",
      category: "SECURITY / ONLINE",
      title: "ハッカーによる攻撃手法の解説イベント",
      description:
        "攻撃手法について学ぶオンラインイベント。詳細や参加条件はイベントページで確認しよう。",
      url: "https://techplay.jp/event/1001429",
      linkText: "イベント詳細を見る",
      featured: false
    },
  ];

  let currentMonth = new Date(2026, 9, 1);
  let selectedDate = "2026-10-23";

  const pad = (number) => String(number).padStart(2, "0");

  const toDateKey = (year, month, day) =>
    `${year}-${pad(month + 1)}-${pad(day)}`;

  const formatDate = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    return `${year}年${month}月${day}日（${weekdays[date.getDay()]}）`;
  };

  function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    calendarMonth.textContent = `${year}年 ${month + 1}月`;
    calendarDays.innerHTML = "";

    // 月曜日始まりにする
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - startOffset);

    // 6週分を表示してカレンダーの高さを安定させる
    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      const dateKey = toDateKey(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.setAttribute("aria-label", formatDate(dateKey));

      if (date.getMonth() !== month) {
        button.classList.add("outside-month");
      }

      if (dateKey === selectedDate) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      const number = document.createElement("span");
      number.className = "day-number";
      number.textContent = date.getDate();
      button.appendChild(number);

      if (events.some((event) => event.date === dateKey)) {
        const dot = document.createElement("span");
        dot.className = "day-dot";
        dot.setAttribute("aria-hidden", "true");
        button.appendChild(dot);
      }

      button.addEventListener("click", () => {
        selectedDate = dateKey;

        // 前月・翌月の日付を選んだ場合も月表示を合わせる
        currentMonth = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );

        renderCalendar();
        renderEventDetails();
      });

      calendarDays.appendChild(button);
    }
  }

  function renderEventDetails() {
    selectedDateText.textContent = formatDate(selectedDate);
    eventDetails.innerHTML = "";

    const selectedEvents = events.filter(
      (event) => event.date === selectedDate
    );

    if (selectedEvents.length === 0) {
      const message = document.createElement("p");
      message.className = "no-events";
      message.textContent =
        "この日のイベントはまだ登録されていません。別の日付もタップしてみよう。";
      eventDetails.appendChild(message);
      return;
    }

    selectedEvents.forEach((event) => {
      const card = document.createElement("article");
      card.className = "event-card";

      if (event.featured) {
        card.classList.add("featured");
      }

      const category = document.createElement("p");
      category.className = "event-category";
      category.textContent = event.category;

      const title = document.createElement("h4");
      title.textContent = event.title;

      const description = document.createElement("p");
      description.className = "event-description";
      description.textContent = event.description;

      const link = document.createElement("a");
      link.className = "event-link";
      link.href = event.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${event.linkText} ↗`;

      card.append(category, title, description, link);
      eventDetails.appendChild(card);
    });
  }

    
  
  
function renderUpcomingEvents() {
  upcomingList.innerHTML = "";

  // 今日の日付を取得（時刻はリセット）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = [
    today.getFullYear(),
    pad(today.getMonth() + 1),
    pad(today.getDate())
  ].join("-");

  // 今日以降のイベントだけを取得して、日付順に並べる
  const sortedEvents = [...events]
    .filter(event => event.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));

  // イベントがない場合
  if (sortedEvents.length === 0) {
    const message = document.createElement("p");
    message.className = "no-events";
    message.textContent = "現在、予定されているイベントはありません。";
    upcomingList.appendChild(message);
    return;
  }

  // イベント一覧を作成
  sortedEvents.forEach((event) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "upcoming-item";

    // 日付
    const date = document.createElement("span");
    date.className = "upcoming-date";

    const [, month, day] = event.date.split("-");
    date.textContent = `${month}.${day}`;

    // イベント情報
    const info = document.createElement("span");
    info.className = "upcoming-info";

    const category = document.createElement("small");
    category.textContent = event.category;

    const title = document.createElement("span");
    title.textContent = event.title;

    info.append(category, title);
    item.append(date, info);

    // イベントをクリックしたらカレンダーの日付を選択
    item.addEventListener("click", () => {
      selectedDate = event.date;

      const [year, month] = event.date.split("-").map(Number);
      currentMonth = new Date(year, month - 1, 1);

      renderCalendar();
      renderEventDetails();

      document.querySelector(".calendar-layout")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });

    upcomingList.appendChild(item);
  });
}




  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  renderCalendar();
  renderEventDetails();
  renderUpcomingEvents();
}
