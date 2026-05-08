# מלאך הזכויות · Rights Angel

> בס״ד

פלטפורמה אזרחית לאיתור והגשת זכויות בארנונה — שיחה טבעית עם AI, סוכן הגשה אוטונומי, ומנגנון אישור־שתיקה משפטי.

**Live Site:** [biztechoff.co.il/rights-angel](https://biztechoff.co.il/rights-angel)

---

## 📋 מה יש כאן

תיקייה זו מכילה את כל החומר השיווקי, המשפטי, והטכני של פרויקט "מלאך הזכויות":

| קובץ | תיאור |
|------|-------|
| `index.html` | עמוד נחיתה ראשי שמרכז את כל המסמכים |
| `architecture/` | תרשים ארכיטקטורה אינטרקטיבי (4 רמות drill-down) |
| `docs/proposal.html` | הצעת מחיר חתומה |
| `docs/deep-qa.html` | 12 שאלות ותשובות טכניות |
| `docs/pitch.html` | דף שיווקי ללקוח |
| `docs/spec.html` | אפיון פרויקט מלא (Phase 0) |
| `assets/` | תמונות וקבצי משאב |

---

## 🏗️ מבנה תיקיות

```
rights-angel/
├── README.md                          ← אתה כאן
├── index.html                         ← עמוד נחיתה ראשי
│
├── architecture/                      ← תרשים אינטרקטיבי
│   ├── index.html                     ← מצב פיתוח (קורא קבצים נפרדים)
│   ├── src/
│   │   ├── data/
│   │   │   └── architecture.js        ← *** כל הנתונים פה ***
│   │   ├── styles.css                 ← עיצוב
│   │   └── app.js                     ← לוגיקה
│   ├── build.py                       ← סקריפט bundle
│   └── dist/
│       └── architecture.html          ← קובץ יחיד מאוחד (לשליחה)
│
├── docs/
│   ├── proposal.html
│   ├── deep-qa.html
│   ├── pitch.html
│   └── spec.html
│
└── assets/
    └── bto_signature.png
```

---

## 🛠️ עריכת התרשים האינטרקטיבי

הקובץ הראשי לעריכה הוא `architecture/src/data/architecture.js` — שם נמצאים **כל** הנתונים: השחקנים, הפעולות, ה-Entities, וה-Methods.

### כדי להוסיף שחקן חדש:

1. פותחים את `architecture/src/data/architecture.js`
2. מוסיפים אובייקט חדש בתוך `actors`
3. מקשרים אליו פעולות (`relatedOps`), entities (`relatedEntities`), ו-methods (`relatedMethods`)
4. מריצים build (ראה למטה)

### כדי להוסיף פעולה חדשה:

1. מוסיפים אובייקט חדש בתוך `operations`
2. מציינים: `title`, `what`, `when`, `how`, `who` (רשימת actor IDs)
3. מציינים `relatedEntity` ו-`relatedMethod` אם רלוונטי
4. מקשרים את הפעולה לשחקנים (ב-`actor.relatedOps`)
5. מריצים build

---

## 📦 בניית הקובץ המאוחד

הקובץ ב-`architecture/dist/architecture.html` הוא **קובץ HTML יחיד** שמכיל את כל הקוד, העיצוב, והנתונים. אפשר לשלוח אותו ב-WhatsApp, מייל, או להעלות לכל שרת — הוא עובד עצמאית.

### דרישות:
- Python 3.6 או חדש יותר

### הרצה:

```bash
cd architecture/
python3 build.py
```

הפלט:
```
✓ Done!
  Output: architecture/dist/architecture.html
  Size:   ~108 KB
```

---

## 🚀 פריסה

### GitHub Pages

1. ההפ את התיקייה ל-`<repo>/rights-angel/`
2. הפעל GitHub Pages
3. הקובץ יהיה זמין ב-`username.github.io/repo/rights-angel/`

### דומיין מותאם (biztechoff.co.il/rights-angel)

1. ב-DNS — הפנה את `biztechoff.co.il` ל-GitHub Pages או לשרת שלך
2. העלה את התיקייה לתיקיית `rights-angel/` בשורש האתר
3. הקישור יעבוד אוטומטית

---

## 📐 ארכיטקטורת המוצר

המוצר עצמו מבוסס על:

- **Backend:** Node.js + Remult + Express
- **Frontend:** Angular (RTL Hebrew)
- **Database:** PostgreSQL
- **Queue:** BullMQ + Redis
- **Storage:** AWS S3
- **AI:** Claude API + Vision
- **WhatsApp:** ספק מסחרי (לא־רשמי בשלב ראשון)
- **Hosting:** Railway

לפרטים מלאים — ראה את הארכיטקטורה האינטרקטיבית או את אפיון הפרויקט (`docs/spec.html`).

---

## ⚖️ הליבה המשפטית

הפלטפורמה מבוססת על **תקנה 3ו לתקנות הסדרים במשק המדינה (הנחה מארנונה), תשנ"ג-1993** — שתיקה של מנהל הארנונה במשך 60 ימים נחשבת לקבלת ההשגה אוטומטית.

זה ה-moat המשפטי הייחודי של המוצר.

---

## 📞 פרטי קשר

**BizTechoff™** · Hod HaSharon, Israel
[biztechoff.co.il](https://biztechoff.co.il)

---

> *— את הזכויות שלך, אני מטפל. —*
