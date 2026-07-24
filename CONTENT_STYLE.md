# Embedded Encyclopedia Content Standard

This project uses the writing rules in [ASD-STE100 Issue 9](https://www.asd-ste100.org/) for technical content.

The encyclopedia contains descriptive technical text. Each page must keep all technical meaning from the source notes.

## Page Workflow

Use this sequence for each page:

1. Record every technical statement, formula, example, qualification, and design rule in the source page.
2. Put related information in a logical learning order.
3. Remove duplicate text only after the retained text contains the complete meaning.
4. Rewrite the text with the rules in this file.
5. Preserve the visual hierarchy and scan pattern of the source page.
6. Add a diagram only when it makes the technical relation easier to understand.
7. Build the site and examine the page on desktop and mobile screens.

Do not delete source content to make a rewrite fit in one work session. If the complete page cannot be rewritten safely, stop and report the limit.

## Standard Page Order

Use the parts that apply to the topic:

1. Purpose and scope
2. Terms and basic principles
3. Circuit or system operation
4. Equations and analysis
5. Nonideal behavior and limits
6. Design rules and trade-offs
7. Applications and examples

## ASD-STE100 Rules for This Project

- Use an approved dictionary word, an electronics technical noun, or an electronics technical verb.
- Use one technical term for one item or concept.
- Define each abbreviation at its first use.
- Use American English spelling.
- Use the active voice when the agent is known.
- Use simple verb tenses.
- Do not use a contraction.
- Do not use a semicolon.
- Do not use a phrasal verb when a direct verb gives the same meaning.
- Use a multi-word noun of three words or fewer when possible.
- Use a maximum of 25 words in a descriptive sentence.
- Put only one topic in each sentence.
- Put only one topic in each paragraph.
- Use a maximum of six sentences in each paragraph.
- Use a vertical list when it makes complex information easier to read.
- Give information gradually. Put prerequisite information before results and design rules.

Electronics terms can be technical nouns. Examples include *source resistance*, *power factor*, *transfer function*, and *noise spectral density*.

Equations, variable names, units, and standard component names keep their accepted engineering forms.

## Visual Hierarchy

The rewrite must preserve useful presentation patterns from the source page.

- Keep bold emphasis on technical terms, design variables, conditions, results, and trade-offs.
- Keep card grids only when the source page already uses card grids.
- Keep paragraphs and standard lists when the source page uses paragraphs and standard lists.
- Keep numbered lists when the sequence or number of reasons is important.
- Keep definition blocks when they help the reader scan a group of technical terms.
- Keep nested bullets when they connect a result, example, or qualification to a parent concept.
- Do not replace a useful visual structure with plain paragraphs only to simplify the language.
- Do not convert paragraphs or standard lists into cards as a design enhancement.
- Add a new card layout only when the user specifically requests that UI change.

Use bold emphasis consistently. Do not use bold emphasis for complete paragraphs.

## Meaning-Preservation Check

Before a rewrite is complete, compare it with the source notes.

Confirm that the rewrite keeps:

- Each definition
- Each causal relation
- Each equation
- Each numerical value and unit
- Each example
- Each condition and exception
- Each consequence
- Each design trade-off

Do not add certainty when the source gives a possibility. Do not remove a qualification to make a sentence shorter.

Reorganization does not give permission to omit content. Confirm each source heading and each nested list against the completed rewrite.

## Visual Standard

Use a visual when it explains a circuit, sequence, waveform, or trade-off better than text alone.

- Use the supplied original image when it is available.
- Store site images in `static/img`.
- Use a base-URL-safe path for each static image.
- Use an original React and SVG diagram when a source image is not available.
- Give each diagram an accessible name and description.
- Make each diagram responsive.
- Do not copy an external image only to fill a gap.
