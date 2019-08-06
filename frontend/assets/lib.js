module.exports.getBoardName = domain => {
  let name = ''
  switch (domain) {
    case 'best':
      name = '핫이슈'
      break
    case 'all':
      name = '전체글'
      break
    case 'girl':
      name = '연예인'
      break
    case 'support':
      name = '서포트'
      break
    case 'notice':
      name = '공지사항'
      break
  }
  return name
}