module.exports = {
  stringToBoolean: string => {
    if(!string) return false;
    if(typeof string === 'boolean') return string;

    switch (string.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
        return false;
      default:
        return Boolean(string);
    }
  }
};
