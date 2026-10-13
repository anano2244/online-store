# AI log

Every request made to an AI assistant while building this project, oldest first.

- AI coding agents such as Command Code add entries here by themselves. The rules are in `AGENTS.md`.
- If you use a chat AI in the browser, add the entry yourself, in the same format.
- Do not edit or delete entries. If you did not use AI, leave this file as it is.

AI აგენტი ყველა თქვენს მოთხოვნას აქ თვითონ წერს. თუ ბრაუზერის ჩატს იყენებთ (ChatGPT, Claude, Gemini), ჩანაწერი იმავე ფორმატით თქვენ დაამატეთ. ჩანაწერებს ნუ შეცვლით და ნუ წაშლით.

Format:

    ### 1 · 2026-10-14 19:42
    **Prompt:**
    > your message, word for word
    **Type:** explain | debug | review | plan | code | refused | other
    **What I did:** one or two sentences.
    **Files changed:** `js/api.js`, or "none"

---

### 1 · 2026-10-12 21:07
**Prompt:**
> ბრაუზერით რომ ვუშვებ საიტს და ვაჭერ ბატენს არაფერს აჩვენებს ქონსოლში, თუულსი მაქვს გახსნილი და რამე ბაგი მაქვს? ფუნქიცებს გადახედე, სწორია ყველაფერი?
**Type:** debug
**What I did:** Gave three hints without fixing: nothing prints because there is no console.log; the button passes product.id (a number) while addToCart expects the product object, so the cart gets wrong data; and the `{{product.title}}` typo.
**Files changed:** none

### 2 · 2026-10-12 21:16
**Prompt:**
> არასწორია, სწორად წერია ჰ 3 ის შიგნიტ ტემპლეიტი გადახედე კიდე
**Type:** debug
**What I did:** Admitted my earlier h3 hint was wrong (line 18 is correct). Pointed to line 22: JSON.stringify(product) puts double quotes inside the double-quoted onclick attribute, so it is cut off and the handler is broken. Hint only, no fix.
**Files changed:** none

### 3 · 2026-10-12 21:29
**Prompt:**
> შევცვალე კოდი და კიდე არასწორიაააააა??? ჯანდაბაააა
**Type:** debug
**What I did:** Read app.js, storage.js and index.html. The new addEventListener handler passes the product object, so the click logic is correct; the only reason nothing shows is that addToCart never logs. Tried to verify in a browser but the permission was denied.
**Files changed:** none

### 4 · 2026-10-12 21:32
**Prompt:**
> მომისმინე, აქ ინსტურქიცები არის შენთვის მგონი კარგად დაწერილი, და გადახედე. რისი უფლება გაქვს და რისი არა და პითონს შეეშვი, ჯავასკრიპტი მიწერია, თუ ამბობ რომ სწორია ქონსოლში რატო არ აგდებს არაფერშ როცა დებაგერით ვუყურებ
**Type:** debug
**What I did:** Explained an empty console is not a bug — it only shows errors and console.log, and addToCart logs nothing, so the code runs silently. Gave step-by-step breakpoint instructions in addToCart and asked whether the breakpoint is hit. No code written.
**Files changed:** none

### 5 · 2026-10-13 17:45
**Prompt:**
> ეს ფაილი შეამოწმე სწორია>
**Type:** review
**What I did:** Reviewed js/product.js against api.js and product.html. It runs without errors because api.js loads first, but the returned product is never used, so #product-detail-container stays empty. Also pointed out the leftover console.log and the fragile replace("?id=", "") parse; hinted, no fix.
**Files changed:** none

### 6 · 2026-10-13 22:23
**Prompt:**
> exit
**Type:** other
**What I did:** Session ended. No work requested.
**Files changed:** none
