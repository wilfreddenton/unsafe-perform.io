function fixFootnoteHrefs() {
	document.querySelectorAll(".footnote-reference a").forEach(e => {
		e.href = window.location + e.hash
	})
}

fixFootnoteHrefs()

hljs.highlightAll()
