# Owen Lempereur — Portfolio

A minimalist brutalist portfolio site. No frameworks, no build tools, no dependencies.


## Files

```
owen-portfolio/
  index.html      ← The site (don't edit)
  style.css       ← The styling (don't edit)
  script.js       ← The logic (don't edit)
  content.json    ← YOUR CONTENT — edit this!
  images/         ← YOUR IMAGES — drop files here!
  README.md       ← This file
```


## Quick Start (first-time setup)

1. **Create a GitHub account** at https://github.com (free)
2. **Create a new repository** named `owenlempereur.github.io`
   - Click the green "New" button on github.com
   - Name it exactly `owenlempereur.github.io` (replace with your username if different)
   - Keep it Public, click "Create repository"
3. **Upload all files**: Click "uploading an existing file", then drag in ALL the files from this folder
4. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch, click Save
5. **Your site is live** at `https://owenlempereur.github.io` (may take 2-3 minutes)


## How to Add/Edit Your Work

### Adding a visual piece (painting, drawing, photography, digital)

1. Go to your repository on github.com
2. Click the `images/` folder → "Add file" → "Upload files" → drag your image in → click "Commit changes"
3. Click `content.json` → click the pencil icon (edit)
4. Find the `"works"` section and add a new entry. Copy this template:

```json
{
  "id": "painting-my-new-piece",
  "title": "Title of Your Piece",
  "category": "painting",
  "image": "images/my-new-piece.jpg",
  "date": "2026",
  "featured": false,
  "description": "A short description of the piece."
}
```

5. **Important:** Make sure there's a comma after the closing `}` of the previous entry!
6. Click "Commit changes". Your site updates in ~1 minute.

**Category options:** `painting`, `drawing`, `photography`, `digital`, `writing`


### Adding a writing project

Same process, but with more fields:

```json
{
  "id": "writing-my-novel",
  "title": "Your Book Title",
  "category": "writing",
  "image": "images/book-cover.jpg",
  "date": "2026",
  "featured": false,

  "genre": "Fantasy · Novel",
  "status": "In Progress · First Draft",
  "pitch": "A two-sentence hook. This is the first thing people read.",
  "description": "What the project is and where it stands.",
  "process": "How the idea came about. This section is hidden behind a toggle on the site.",
  "excerpt": "The opening paragraphs of your book go here. Line breaks are preserved.",
  "link_type": "pdf",
  "link_url": "https://drive.google.com/your-link",
  "link_label": "Read the first chapter"
}
```


### Featuring a piece on the landing page

Set `"featured": true` on the pieces you want on the homepage.
- You should have exactly 1 writing piece and up to 4 visual pieces featured.
- To swap a featured piece, set the old one to `false` and the new one to `true`.


### Removing a piece

Delete its entire block (from `{` to `}`) in the `"works"` array. Make sure you don't leave a trailing comma on the previous entry.


### Editing the About page

In content.json, find the `"about"` section:
```json
"about": {
  "bio": "Your bio text here.",
  "photo": "images/your-photo.jpg"
}
```


### Editing site info

In content.json, find the `"site"` section to change your email, Instagram link, or tagline.


## Tips

- **Image sizes**: Aim for images around 1200-1600px wide. Larger files = slower loading.
- **Image formats**: JPG for photos/paintings, PNG for digital art with transparency.
- **IDs must be unique**: Each piece needs a different `id`. Use the pattern `category-short-name`.
- **JSON is picky**: If the site shows an error, paste your content.json into https://jsonlint.com to find the problem. Common issues:
  - Missing comma between entries
  - Extra comma after the last entry in the list
  - Missing or mismatched quotation marks
- **Custom domain**: To use `owenlempereur.com` instead of `owenlempereur.github.io`, buy a domain (~€10/year from Namecheap or Google Domains) and follow [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).


## File Structure Explained

- `index.html` — The site structure (pages, navigation). You won't need to edit this.
- `style.css` — All the visual styling. You won't need to edit this.
- `script.js` — Reads content.json and builds the pages. You won't need to edit this.
- `content.json` — **This is your file.** All your work, bio, and site info lives here.
- `images/` — **This is your folder.** All your images go here.
