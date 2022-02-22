function fixFootnoteHrefs() {
	document.querySelectorAll(".footnote-reference a").forEach(e => {
		e.href = window.location.pathname + e.hash
	})
}

fixFootnoteHrefs()

hljs.highlightAll()
