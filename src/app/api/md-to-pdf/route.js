import { NextResponse } from 'next/server';

const css = `

h1, h2 {
    color: MidnightBlue;
}

table {
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid DimGray;
}

th, td {
  text-align: left;
  padding: 1em;
}
/* PDF Styles for Markdown Content */

/* Base Styles - Mimicking Notion's clean look */
body { /* Apply styles to the body for PDF context */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; /* Notion-like font stack */
  line-height: 1.6;
  color: #333; /* Darker gray text for readability */
  font-size: 12pt; /* Base font size for PDF - points are often preferred for print */
  padding: 0;
  margin: 0;
  word-wrap: break-word;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: bold; /* Semi-bold headings - 'bold' is generally safer for PDF */
  line-height: 1.3;
  margin-top: 1em; /* Using 'em' for relative spacing based on font size */
  margin-bottom: 0.5em;
  color: #1e1e1e; /* Slightly darker heading color */
}

h1 {
  font-size: 24pt; /* ~36px in points for PDF */
}

h2 {
  font-size: 20pt; /* ~28px in points for PDF */
}

h3 {
  font-size: 16pt; /* ~22px in points for PDF */
}

h4 {
  font-size: 14pt; /* ~18px in points for PDF */
}

h5 {
  font-size: 12pt;    /* ~16px - same as base in points for PDF */
}

h6 {
  font-size: 10pt; /* ~14px in points for PDF */
  color: #555; /* Lighter for smaller headings */
}

/* Paragraphs */
p {
  margin-top: 0;
  margin-bottom: 0.75em; /* Adjust bottom margin for PDF spacing */
}

/* Links */
a {
  color: #007bff; /* Notion-like link color */
  text-decoration: underline; /* Underline is more standard for links in PDFs */
}


/* Bold and Strong */
strong, b {
  font-weight: bold; /* 'bold' is generally safer for PDF */
}

/* Italic and Emphasis */
em, i {
  font-style: italic;
}

/* Strikethrough */
del, s {
  text-decoration: line-through;
  opacity: 0.7; /* Slightly faded strikethrough */
}

/* Blockquotes */
blockquote {
  border-left: 3px solid #ddd; /* Light gray left border */
  padding-left: 1em;
  margin: 0.75em 0; /* Adjust margins for PDF spacing */
  font-style: italic;
  color: #777; /* Grayish blockquote text */
}

/* Lists (Unordered and Ordered) */
ul, ol {
  padding-left: 1.5em; /* Indentation for lists */
  margin-top: 0.25em; /* Adjust top margin for PDF spacing */
  margin-bottom: 0.5em; /* Adjust bottom margin for PDF spacing */
}

ul li, ol li {
  margin-bottom: 0.25em; /* Reduce spacing between list items for PDF */
}

ul {
  list-style-type: disc; /* Default bullet style */
}

ol {
  list-style-type: decimal; /* Default numbered style */
}

/* Code Blocks */
pre {
  background-color: #f6f8fa; /* Light gray background for code blocks */
  padding: 0.75em; /* Adjust padding for PDF spacing */
  border-radius: 4px;
  overflow-x: auto; /* Horizontal scroll for long code lines */
  margin-top: 0.5em; /* Adjust top margin for PDF spacing */
  margin-bottom: 0.5em; /* Adjust bottom margin for PDF spacing */
  font-family: monospace, monospace; /* Monospace font for code */
  font-size: 10pt; /* Adjust code font size for PDF readability */
  line-height: 1.4;
  border: 1px solid #eee; /* Subtle border */
}

code {
  font-family: monospace, monospace; /* Monospace for inline code too */
  padding: 0.2em 0.4em;
  background-color: #f0f0f0; /* Lighter gray for inline code background */
  border-radius: 3px;
  font-size: 10pt; /* Adjust inline code font size for PDF consistency */
}

/* Inline Code within Pre (for syntax highlighting if needed later) */
pre code {
  background-color: transparent; /* Remove background within pre */
  padding: 0;
  border-radius: 0;
}


/* Horizontal Rule */
hr {
  border: 0;
  border-top: 1px solid #eee; /* Light gray horizontal line */
  margin: 1em 0; /* Adjust margins for PDF spacing */
}
  /* Images (Basic styling, Notion handles images in blocks differently) */
img {
  max-width: 100%; /* Make images responsive within PDF page width */
  height: auto;
  display: block; /* Remove bottom spacing */
  margin: 0.5em auto; /* Center images, adjust margins for PDF spacing */
  border-radius: 4px; /* Slightly rounded corners for images */
}

/* Tables - Basic styling, Notion handles tables in blocks differently */

table {
  border-collapse: collapse;
  margin-bottom: 0.5em; /* Add some bottom margin to tables in PDF */
}

th,
td {
  border: 1px solid #ddd; /* Use a lighter border color for PDF tables */
  padding: 0.5em; /* Reduce padding for table cells in PDF */
  text-align: left;
  font-size: 10pt; /* Adjust table font size for PDF readability */
}

th {
  font-weight: bold;
  background-color: #f0f0f0; /* Light background for table headers */
}
`

export async function POST(request) {
    try {
        const { markdown } = await request.json(); // Parse JSON body

        const apiUrl = 'https://md-to-pdf.fly.dev/';

        const formData = new URLSearchParams();
        formData.append('markdown', markdown);
        formData.append('css', css);

        const pdfResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!pdfResponse.ok) {
            const errorText = await pdfResponse.text();
            console.error('md-to-pdf API error:', errorText);
            return new NextResponse(`md-to-pdf API Error: ${pdfResponse.status} - ${errorText}`, {
                status: pdfResponse.status,
            });
        }

        const pdfBlob = await pdfResponse.blob();
        const buffer = await pdfBlob.arrayBuffer();
        const headers = new Headers();
        headers.append('Content-Disposition', 'attachment; filename="markdown-document.pdf"');
        headers.append('Content-Type', 'application/pdf'); // Set correct MIME type

        return new NextResponse(Buffer.from(buffer), { // Send buffer directly
            status: 200,
            headers: headers,
        });


    } catch (error) {
        console.error('API Route Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}