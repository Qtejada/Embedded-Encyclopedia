# Embedded Encyclopedia Content Standard

Use clear, natural engineering prose at the level of a recent engineering graduate refreshing their notes. Keep the technical depth, but explain the idea before relying on specialist shorthand.

This standard replaces the previous ASD-STE100 wording rules at the owner's request. Historical review documents describe earlier work; they do not define the current voice.

## Voice and explanations

- Explain what a component or system does, how it does it, and what the result means in practice.
- Prefer familiar words and direct sentences. Use natural contractions when they fit; do not force them.
- Keep necessary engineering terms, then explain them at their first substantive use. A term such as phase margin should connect to circuit behavior, not stand in for the explanation.
- Define abbreviations before relying on them. Keep established symbols, units, part names, and technical distinctions.
- Connect sentences into readable paragraphs. Do not turn every sentence into a command or fragment.
- Use concrete examples to clarify an existing idea. Keep assumptions and limits with each example.
- Avoid canned labels such as “The problem,” “The fix,” and “Why it matters.” Let the paragraph explain the relationship.
- Avoid grand claims, decorative jargon, and repeated reminders that a passage is important.
- Do not use “thus.” Use American English spelling.
- Do not impose a fixed sentence length or an approved-word dictionary at the expense of natural explanation.

## Organization and presentation

Keep the current textbook structure: headings, explanatory paragraphs, equations, useful lists, tables, examples, and diagrams. A prose rewrite is not permission to redesign the page.

- Preserve heading text and explicit IDs so existing subsection links keep working.
- Use lists for genuine comparisons, choices, and ordered procedures. Do not turn every explanation into a labeled list.
- Keep bold emphasis selective, especially for newly defined terms and important results.
- Preserve image references, captions, source attribution, component embeds, and downloadable circuits.
- Link to the relevant subsection when a concept depends on another topic.
- Do not add card layouts or new UI patterns without a separate reason or request.

## Preserve technical meaning

Before editing, save the original text. Compare each changed passage with it afterward.

Retain definitions, cause-and-effect relationships, equations, values and units, examples, assumptions, exceptions, consequences, and design trade-offs. Do not remove a qualification or turn “can” into “always” to shorten an explanation.

Simplifying wording does not mean simplifying away the subject. Explain unfamiliar ideas instead of removing them. If an existing technical claim is wrong or too absolute, verify it against a primary source and record the correction separately from ordinary wording changes.

Do not remove content to finish within a work session. Do not overwrite historical preservation snapshots to make an old exact-wording test pass.

## Review and verification

1. Review the changed prose against the saved version for technical meaning and readability.
2. Check that formulas, code, figures, interactive components, and subsection destinations remain intact.
3. Build the site and validate rendered routes, anchors, and assets.
4. Check desktop and mobile presentation when markup or layout changes affect it.
5. Summarize changes and any technical corrections for review.

The older append-only and STE audits record previous acceptance conditions. They are not proof of this rewrite, and their exact-prose checks will intentionally differ after an authorized rewrite. Keep those records intact and use the readability preservation audit for this update.

## Visuals

Use a visual when it explains a circuit, sequence, waveform, or trade-off more clearly than text. Prefer the supplied source image or an original React/SVG diagram when appropriate. Keep static image paths base-URL-safe, provide accessible descriptions, and preserve responsive sizing. Do not copy an unrelated external image merely to fill a gap.
