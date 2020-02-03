module.exports.getBoardName = domain => {
  let name = ''
  switch (domain) {
    case 'best':
      name = '인기'
      break
    case 'all':
      name = '전체'
      break
    case 'talk':
      name = 'TALK'
      break
    case 'girl':
      name = '연예'
      break
    case 'anime':
      name = '애니'
      break
    case 'notice':
      name = '공지사항'
      break
  }
  return name
}