function normalizeAnswer(text = '') {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[.,!?;:"'()`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = normalizeAnswer;
