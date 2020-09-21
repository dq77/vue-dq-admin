export function saveParameter(path, parameter, listQuery) {
  sessionStorage.setItem('pageFlag', true);
  sessionStorage.setItem('path', path);
  sessionStorage.setItem('parameter', parameter);
  sessionStorage.setItem('listQuery', listQuery)
}
