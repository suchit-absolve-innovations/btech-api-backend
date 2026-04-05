module.exports = {
  up: async (queryInterface, Sequelize) => [
    await queryInterface.bulkInsert('CountryCode', [
      {
        id: '1',
        country: 'Afghanistan',
        countryCode: 'AF',
        internationalDialing: '+93',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        country: 'Albania',
        countryCode: 'AL',
        internationalDialing: '+355',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        country: 'Algeria',
        countryCode: 'DZ',
        internationalDialing: '+213',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        country: 'American Samoa',
        countryCode: 'AS',
        internationalDialing: '+1-684',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        country: 'Andorra, Principality of',
        countryCode: 'AD',
        internationalDialing: '+376',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        country: 'Angola',
        countryCode: 'AO',
        internationalDialing: '+244',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '7',
        country: 'Anguilla',
        countryCode: 'AI',
        internationalDialing: '+1-264',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8',
        country: 'Antarctica',
        countryCode: 'AQ',
        internationalDialing: '+672',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '9',
        country: 'Antigua and Barbuda',
        countryCode: 'AG',
        internationalDialing: '+1-268',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '10',
        country: 'Argentina',
        countryCode: 'AR',
        internationalDialing: '+54',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '11',
        country: 'Armenia',
        countryCode: 'AM',
        internationalDialing: '+374',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '12',
        country: 'Aruba',
        countryCode: 'AW',
        internationalDialing: '+297',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '13',
        country: 'Australia',
        countryCode: 'AU',
        internationalDialing: '+61',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '14',
        country: 'Austria',
        countryCode: 'AT',
        internationalDialing: '+43',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '15',
        country: 'Azerbaijan or Azerbaidjan (Former Azerbaijan Soviet Socialist Republic)',
        countryCode: 'AZ',
        internationalDialing: '+994',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '16',
        country: 'Bahamas, Commonwealth of The',
        countryCode: 'BS',
        internationalDialing: '+1-242',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '17',
        country: 'Bahrain, Kingdom of (Former Dilmun)',
        countryCode: 'BH',
        internationalDialing: '+973',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '18',
        country: 'Bangladesh (Former East Pakistan)',
        countryCode: 'BD',
        internationalDialing: '+880',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '19',
        country: 'Barbados',
        countryCode: 'BB',
        internationalDialing: '+1-246',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '20',
        country: 'Belarus (Former Belorussian [Byelorussian] Soviet Socialist Republic)',
        countryCode: 'BY',
        internationalDialing: '+375',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '21',
        country: 'Belgium',
        countryCode: 'BE',
        internationalDialing: '+32',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '22',
        country: 'Belize (Former British Honduras)',
        countryCode: 'BZ',
        internationalDialing: '+501',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '23',
        country: 'Benin (Former Dahomey)',
        countryCode: 'BJ',
        internationalDialing: '+229',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '24',
        country: 'Bermuda',
        countryCode: 'BM',
        internationalDialing: '+1-441',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '25',
        country: 'Bhutan, Kingdom of',
        countryCode: 'BT',
        internationalDialing: '+975',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '26',
        country: 'Bolivia',
        countryCode: 'BO',
        internationalDialing: '+591',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '27',
        country: 'Bosnia and Herzegovina',
        countryCode: 'BA',
        internationalDialing: '+387',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '28',
        country: 'Botswana (Former Bechuanaland)',
        countryCode: 'BW',
        internationalDialing: '+267',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '29',
        country: 'Bouvet Island (Territory of Norway)',
        countryCode: 'BV',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '30',
        country: 'Brazil',
        countryCode: 'BR',
        internationalDialing: '+55',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '31',
        country: 'British Indian Ocean Territory (BIOT)',
        countryCode: 'IO',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '32',
        country: 'Brunei (Negara Brunei Darussalam)',
        countryCode: 'BN',
        internationalDialing: '+673',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '33',
        country: 'Bulgaria',
        countryCode: 'BG',
        internationalDialing: '+359',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '34',
        country: 'Burkina Faso (Former Upper Volta)',
        countryCode: 'BF',
        internationalDialing: '+226',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '35',
        country: 'Burundi (Former Urundi)',
        countryCode: 'BI',
        internationalDialing: '+257',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '36',
        country: 'Cambodia, Kingdom of (Former Khmer Republic, Kampuchea Republic)',
        countryCode: 'KH',
        internationalDialing: '+855',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '37',
        country: 'Cameroon (Former French Cameroon)',
        countryCode: 'CM',
        internationalDialing: '+237',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '38',
        country: 'Canada',
        countryCode: 'CA',
        internationalDialing: '+1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '39',
        country: 'Cape Verde',
        countryCode: 'CV',
        internationalDialing: '+238',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '40',
        country: 'Cayman Islands',
        countryCode: 'KY',
        internationalDialing: '+1-345',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '41',
        country: 'Central African Republic',
        countryCode: 'CF',
        internationalDialing: '+236',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '42',
        country: 'Chad',
        countryCode: 'TD',
        internationalDialing: '+235',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '43',
        country: 'Chile',
        countryCode: 'CL',
        internationalDialing: '+56',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '44',
        country: 'China',
        countryCode: 'CN',
        internationalDialing: '+86',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '45',
        country: 'Christmas Island',
        countryCode: 'CX',
        internationalDialing: '+53',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '46',
        country: 'Cocos (Keeling) Islands',
        countryCode: 'CC',
        internationalDialing: '+61',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '47',
        country: 'Colombia',
        countryCode: 'CO',
        internationalDialing: '+57',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '48',
        country: 'Comoros, Union of the',
        countryCode: 'KM',
        internationalDialing: '+269',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '49',
        country: 'Congo, Democratic Republic of the (Former Zaire)',
        countryCode: 'CD',
        internationalDialing: '+243',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '50',
        country: 'Congo, Republic of the',
        countryCode: 'CG',
        internationalDialing: '+242',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '51',
        country: 'Cook Islands (Former Harvey Islands)',
        countryCode: 'CK',
        internationalDialing: '+682',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '52',
        country: 'Costa Rica',
        countryCode: 'CR',
        internationalDialing: '+506',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '53',
        country: "Cote D'Ivoire (Former Ivory Coast)",
        countryCode: 'CI',
        internationalDialing: '+225',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '54',
        country: 'Croatia (Hrvatska)',
        countryCode: 'HR',
        internationalDialing: '+385',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '55',
        country: 'Cuba',
        countryCode: 'CU',
        internationalDialing: '+53',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '56',
        country: 'Cyprus',
        countryCode: 'CY',
        internationalDialing: '+357',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '57',
        country: 'Czech Republic',
        countryCode: 'CZ',
        internationalDialing: '+420',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '58',
        country: 'Czechoslavakia (Former) See CZ Czech Republic or Slovakia',
        countryCode: 'CS',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '59',
        country: 'Denmark',
        countryCode: 'DK',
        internationalDialing: '+45',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '60',
        country: 'Djibouti (Former French Territory of the Afars and Issas, French Somaliland)',
        countryCode: 'DJ',
        internationalDialing: '+253',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '61',
        country: 'Dominica',
        countryCode: 'DM',
        internationalDialing: '+1-767',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '63',
        country: 'East Timor (Former Portuguese Timor)',
        countryCode: 'TP',
        internationalDialing: '+670',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '64',
        country: 'Ecuador',
        countryCode: 'EC',
        internationalDialing: '+593 ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '65',
        country: 'Egypt (Former United Arab Republic - with Syria)',
        countryCode: 'EG',
        internationalDialing: '+20',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '66',
        country: 'El Salvador',
        countryCode: 'SV',
        internationalDialing: '+503',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '67',
        country: 'Equatorial Guinea (Former Spanish Guinea)',
        countryCode: 'GQ',
        internationalDialing: '+240',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '68',
        country: 'Eritrea (Former Eritrea Autonomous Region in Ethiopia)',
        countryCode: 'ER',
        internationalDialing: '+291',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '69',
        country: 'Estonia (Former Estonian Soviet Socialist Republic)',
        countryCode: 'EE',
        internationalDialing: '+372',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '70',
        country: 'Ethiopia (Former Abyssinia, Italian East Africa)',
        countryCode: 'ET',
        internationalDialing: '+251',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '71',
        country: 'Falkland Islands (Islas Malvinas)',
        countryCode: 'FK',
        internationalDialing: '+500',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '72',
        country: 'Faroe Islands ',
        countryCode: 'FO',
        internationalDialing: '+298',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '73',
        country: 'Fiji',
        countryCode: 'FJ',
        internationalDialing: '+679',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '74',
        country: 'Finland',
        countryCode: 'FI',
        internationalDialing: '+358',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '75',
        country: 'France ',
        countryCode: 'FR',
        internationalDialing: '+33',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '76',
        country: 'French Guiana or French Guyana',
        countryCode: 'GF',
        internationalDialing: '+594',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '77',
        country: 'French Polynesia (Former French Colony of Oceania)',
        countryCode: 'PF',
        internationalDialing: '+689',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '78',
        country: 'French Southern Territories and Antarctic Lands',
        countryCode: 'TF',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '79',
        country: 'Gabon (Gabonese Republic)',
        countryCode: 'GA',
        internationalDialing: '+241',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '80',
        country: 'Gambia, The',
        countryCode: 'GM',
        internationalDialing: '+220',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '81',
        country: 'Georgia (Former Georgian Soviet Socialist Republic)',
        countryCode: 'GE',
        internationalDialing: '+995',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '82',
        country: 'Germany',
        countryCode: 'DE',
        internationalDialing: '+49',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '83',
        country: 'Ghana (Former Gold Coast)',
        countryCode: 'GH',
        internationalDialing: '+233',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '84',
        country: 'Gibraltar',
        countryCode: 'GI',
        internationalDialing: '+350',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '85',
        country: 'Great Britain (United Kingdom)',
        countryCode: 'GB',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '86',
        country: 'Greece ',
        countryCode: 'GR',
        internationalDialing: '+30',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '87',
        country: 'Greenland',
        countryCode: 'GL',
        internationalDialing: '+299',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '88',
        country: 'Grenada',
        countryCode: 'GD',
        internationalDialing: '+1-473',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '89',
        country: 'Guadeloupe',
        countryCode: 'GP',
        internationalDialing: '+590',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '90',
        country: 'Guam',
        countryCode: 'GU',
        internationalDialing: '+1-671',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '91',
        country: 'Guatemala',
        countryCode: 'GT',
        internationalDialing: '+502',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '92',
        country: 'Guinea (Former French Guinea)',
        countryCode: 'GN',
        internationalDialing: '+224',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '93',
        country: 'Guinea-Bissau (Former Portuguese Guinea)',
        countryCode: 'GW',
        internationalDialing: '+245',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '94',
        country: 'Guyana (Former British Guiana)',
        countryCode: 'GY',
        internationalDialing: '+592',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '95',
        country: 'Haiti',
        countryCode: 'HT',
        internationalDialing: '+509',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '96',
        country: 'Heard Island and McDonald Islands (Territory of Australia)',
        countryCode: 'HM',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '97',
        country: 'Holy See (Vatican City State)',
        countryCode: 'VA',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '98',
        country: 'Honduras',
        countryCode: 'HN',
        internationalDialing: '+504',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '99',
        country: 'Hong Kong',
        countryCode: 'HK',
        internationalDialing: '+852',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '100',
        country: 'Hungary',
        countryCode: 'HU',
        internationalDialing: '+36',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '101',
        country: 'Iceland',
        countryCode: 'IS',
        internationalDialing: '+354',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '102',
        country: 'India',
        countryCode: 'IN',
        internationalDialing: '+91',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '103',
        country: 'Indonesia (Former Netherlands East Indies; Dutch East Indies)',
        countryCode: 'ID',
        internationalDialing: '+62',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '104',
        country: 'Iran, Islamic Republic of',
        countryCode: 'IR',
        internationalDialing: '+98',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '105',
        country: 'Iraq',
        countryCode: 'IQ',
        internationalDialing: '+964',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '106',
        country: 'Ireland',
        countryCode: 'IE',
        internationalDialing: '+353',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '107',
        country: 'Israel',
        countryCode: 'IL',
        internationalDialing: '+972',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '108',
        country: 'Italy',
        countryCode: 'IT',
        internationalDialing: '+39',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '109',
        country: 'Jamaica',
        countryCode: 'JM',
        internationalDialing: '+1-876',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '110',
        country: 'Japan',
        countryCode: 'JP',
        internationalDialing: '+81',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '111',
        country: 'Jordan (Former Transjordan)',
        countryCode: 'JO',
        internationalDialing: '+962',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '112',
        country: 'Kazakstan or Kazakhstan (Former Kazakh Soviet Socialist Republic)',
        countryCode: 'KZ',
        internationalDialing: '+7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '113',
        country: 'Kenya (Former British East Africa)',
        countryCode: 'KE',
        internationalDialing: '+254',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '114',
        country: 'Kiribati (Pronounced keer-ree-bahss) (Former Gilbert Islands)',
        countryCode: 'KI',
        internationalDialing: '+686',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '115',
        country: "Korea, Democratic People's Republic of (North Korea)",
        countryCode: 'KP',
        internationalDialing: '+850',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '116',
        country: 'Korea, Republic of (South Korea)',
        countryCode: 'KR',
        internationalDialing: '+82',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '117',
        country: 'Kuwait',
        countryCode: 'KW',
        internationalDialing: '+965',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '118',
        country: 'Kyrgyzstan (Kyrgyz Republic) (Former Kirghiz Soviet Socialist Republic)',
        countryCode: 'KG',
        internationalDialing: '+996',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '119',
        country: "Lao People's Democratic Republic (Laos)",
        countryCode: 'LA',
        internationalDialing: '+856',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '120',
        country: 'Latvia (Former Latvian Soviet Socialist Republic)',
        countryCode: 'LV',
        internationalDialing: '+371',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '121',
        country: 'Lebanon ',
        countryCode: 'LB',
        internationalDialing: '+961',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '122',
        country: 'Lesotho (Former Basutoland)',
        countryCode: 'LS',
        internationalDialing: '+266',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '123',
        country: 'Liberia ',
        countryCode: 'LR',
        internationalDialing: '+231',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '124',
        country: 'Libya (Libyan Arab Jamahiriya)',
        countryCode: 'LY',
        internationalDialing: '+218',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '125',
        country: 'Liechtenstein',
        countryCode: 'LI',
        internationalDialing: '+423',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '126',
        country: 'Lithuania (Former Lithuanian Soviet Socialist Republic)',
        countryCode: 'LT',
        internationalDialing: '+370',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '127',
        country: 'Luxembourg ',
        countryCode: 'LU',
        internationalDialing: '+352',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '128',
        country: 'Macau ',
        countryCode: 'MO',
        internationalDialing: '+853',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '129',
        country: 'Macedonia, The Former Yugoslav Republic of',
        countryCode: 'MK',
        internationalDialing: '+389',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '130',
        country: 'Madagascar (Former Malagasy Republic)',
        countryCode: 'MG',
        internationalDialing: '+261',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '131',
        country: 'Malawi (Former British Central African Protectorate, Nyasaland)',
        countryCode: 'MW',
        internationalDialing: '+265',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '132',
        country: 'Malaysia ',
        countryCode: 'MY',
        internationalDialing: '+60',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '133',
        country: 'Maldives ',
        countryCode: 'MV',
        internationalDialing: '+960',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '134',
        country: 'Mali (Former French Sudan and Sudanese Republic)',
        countryCode: 'ML',
        internationalDialing: '+223',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '135',
        country: 'Malta',
        countryCode: 'MT',
        internationalDialing: '+356',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '136',
        country: 'Marshall Islands (Former Marshall Islands District - Trust Territory of the Pacific Islands)',
        countryCode: 'MH',
        internationalDialing: '+692',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '137',
        country: 'Martinique (French)',
        countryCode: 'MQ',
        internationalDialing: '+596',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '138',
        country: 'Mauritania ',
        countryCode: 'MR',
        internationalDialing: '+222',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '139',
        country: 'Mauritius',
        countryCode: 'MU',
        internationalDialing: '+230',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '140',
        country: 'Mayotte (Territorial Collectivity of Mayotte)',
        countryCode: 'YT',
        internationalDialing: '+269',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '141',
        country: 'Mexico',
        countryCode: 'MX',
        internationalDialing: '+52',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '142',
        country:
          'Micronesia, Federated States of (Former Ponape, Truk, and Yap Districts - Trust Territory of the Pacific Islands)',
        countryCode: 'FM',
        internationalDialing: '+691',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '143',
        country: 'Moldova, Republic of',
        countryCode: 'MD',
        internationalDialing: '+373',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '144',
        country: 'Monaco, Principality of',
        countryCode: 'MC',
        internationalDialing: '+377',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '145',
        country: 'Mongolia (Former Outer Mongolia)',
        countryCode: 'MN',
        internationalDialing: '+976',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '146',
        country: 'Montserrat ',
        countryCode: 'MS',
        internationalDialing: '+1-664',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '147',
        country: 'Morocco ',
        countryCode: 'MA',
        internationalDialing: '+212',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '148',
        country: 'Mozambique (Former Portuguese East Africa)',
        countryCode: 'MZ',
        internationalDialing: '+258',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '149',
        country: 'Myanmar, Union of (Former Burma)',
        countryCode: 'MM',
        internationalDialing: '+95',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '150',
        country: 'Namibia (Former German Southwest Africa, South-West Africa)',
        countryCode: 'NA',
        internationalDialing: '+264',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '151',
        country: 'Nauru (Former Pleasant Island)',
        countryCode: 'NR',
        internationalDialing: '+674',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '152',
        country: 'Nepal',
        countryCode: 'NP',
        internationalDialing: '+977',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '153',
        country: 'Netherlands',
        countryCode: 'NL',
        internationalDialing: '+31',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '154',
        country: 'Netherlands Antilles (Former Curacao and Dependencies)',
        countryCode: 'AN',
        internationalDialing: '+599',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '155',
        country: 'New Caledonia',
        countryCode: 'NC',
        internationalDialing: '+687',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '156',
        country: 'New Zealand (Aotearoa)',
        countryCode: 'NZ',
        internationalDialing: '+64',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '157',
        country: 'Nicaragua',
        countryCode: 'NI',
        internationalDialing: '+505',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '158',
        country: 'Niger',
        countryCode: 'NE',
        internationalDialing: '+227',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '159',
        country: 'Nigeria',
        countryCode: 'NG',
        internationalDialing: '+234',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '160',
        country: 'Niue (Former Savage Island)',
        countryCode: 'NU',
        internationalDialing: '+683',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '161',
        country: 'Norfolk Island',
        countryCode: 'NF',
        internationalDialing: '+672',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '162',
        country:
          'Northern Mariana Islands (Former Mariana Islands District - Trust Territory of the Pacific Islands)',
        countryCode: 'MP',
        internationalDialing: '+1-670',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '163',
        country: 'Norway',
        countryCode: 'NO',
        internationalDialing: '+47',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '164',
        country: 'Oman, Sultanate of (Former Muscat and Oman)',
        countryCode: 'OM',
        internationalDialing: '+968',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '166',
        country: 'Palau (Former Palau District - Trust Terriroty of the Pacific Islands)',
        countryCode: 'PW',
        internationalDialing: '+680',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '167',
        country: 'Palestinian State (Proposed)',
        countryCode: 'PS',
        internationalDialing: '+970',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '168',
        country: 'Panama',
        countryCode: 'PA',
        internationalDialing: '+507',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '169',
        country: 'Papua New Guinea (Former Territory of Papua and New Guinea)',
        countryCode: 'PG',
        internationalDialing: '+675',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '170',
        country: 'Paraguay',
        countryCode: 'PY',
        internationalDialing: '+595',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '171',
        country: 'Peru',
        countryCode: 'PE',
        internationalDialing: '+51',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '172',
        country: 'Philippines',
        countryCode: 'PH',
        internationalDialing: '+63',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '173',
        country: 'Pitcairn Island',
        countryCode: 'PN',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '174',
        country: 'Poland',
        countryCode: 'PL',
        internationalDialing: '+48',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '175',
        country: 'Portugal',
        countryCode: 'PT',
        internationalDialing: '+351',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '176',
        country: 'Puerto Rico',
        countryCode: 'PR',
        internationalDialing: '+1-787 or +1-939',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '177',
        country: 'Qatar, State of',
        countryCode: 'QA',
        internationalDialing: '+974 ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '178',
        country: 'Reunion (French) (Former Bourbon Island)',
        countryCode: 'RE',
        internationalDialing: '+262',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '179',
        country: 'Romania',
        countryCode: 'RO',
        internationalDialing: '+40',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '180',
        country:
          'Russia - USSR (Former Russian Empire, Union of Soviet Socialist Republics, Russian Soviet Federative Socialist Republic) Now RU - Russian Federation',
        countryCode: 'SU',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '181',
        country: 'Russian Federation',
        countryCode: 'RU',
        internationalDialing: '+7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '182',
        country: 'Rwanda (Rwandese Republic) (Former Ruanda)',
        countryCode: 'RW',
        internationalDialing: '+250',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '183',
        country: 'Saint Helena',
        countryCode: 'SH',
        internationalDialing: '+290',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '184',
        country: 'Saint Kitts and Nevis (Former Federation of Saint Christopher and Nevis)',
        countryCode: 'KN',
        internationalDialing: '+1-869',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '185',
        country: 'Saint Lucia',
        countryCode: 'LC',
        internationalDialing: '+1-758',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '186',
        country: 'Saint Pierre and Miquelon',
        countryCode: 'PM',
        internationalDialing: '+508',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '187',
        country: 'Saint Vincent and the Grenadines',
        countryCode: 'VC',
        internationalDialing: '+1-784',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '188',
        country: 'Samoa (Former Western Samoa)',
        countryCode: 'WS',
        internationalDialing: '+685',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '189',
        country: 'San Marino',
        countryCode: 'SM',
        internationalDialing: '+378',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '190',
        country: 'Sao Tome and Principe',
        countryCode: 'ST',
        internationalDialing: '+239',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '191',
        country: 'Saudi Arabia',
        countryCode: 'SA',
        internationalDialing: '+966',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '192',
        country: 'Serbia, Republic of',
        countryCode: 'RS',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '193',
        country: 'Senegal',
        countryCode: 'SN',
        internationalDialing: '+221',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '194',
        country: 'Seychelles ',
        countryCode: 'SC',
        internationalDialing: '+248',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '195',
        country: 'Sierra Leone',
        countryCode: 'SL',
        internationalDialing: '+232',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '196',
        country: 'Singapore',
        countryCode: 'SG',
        internationalDialing: '+65',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '197',
        country: 'Slovakia',
        countryCode: 'SK',
        internationalDialing: '+421',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '198',
        country: 'Slovenia',
        countryCode: 'SI',
        internationalDialing: '+386',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '199',
        country: 'Solomon Islands (Former British Solomon Islands)',
        countryCode: 'SB',
        internationalDialing: '+677',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '200',
        country: 'Somalia (Former Somali Republic, Somali Democratic Republic)',
        countryCode: 'SO',
        internationalDialing: '+252',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '201',
        country: 'South Africa (Former Union of South Africa)',
        countryCode: 'ZA',
        internationalDialing: '+27',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '202',
        country: 'South Georgia and the South Sandwich Islands',
        countryCode: 'GS',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '203',
        country: 'Spain',
        countryCode: 'ES',
        internationalDialing: '+34',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '204',
        country: 'Sri Lanka (Former Serendib, Ceylon)',
        countryCode: 'LK',
        internationalDialing: '+94',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '205',
        country: 'Sudan (Former Anglo-Egyptian Sudan)',
        countryCode: 'SD',
        internationalDialing: '+249',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '206',
        country: 'Suriname (Former Netherlands Guiana, Dutch Guiana)',
        countryCode: 'SR',
        internationalDialing: '+597',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '207',
        country: 'Svalbard (Spitzbergen) and Jan Mayen Islands',
        countryCode: 'SJ',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '208',
        country: 'Swaziland, Kingdom of',
        countryCode: 'SZ',
        internationalDialing: '+268',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '209',
        country: 'Sweden',
        countryCode: 'SE',
        internationalDialing: '+46',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '210',
        country: 'Switzerland',
        countryCode: 'CH',
        internationalDialing: '+41',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '211',
        country: 'Syria (Syrian Arab Republic) (Former United Arab Republic - with Egypt)',
        countryCode: 'SY',
        internationalDialing: '+963',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '212',
        country: 'Taiwan (Former Formosa)',
        countryCode: 'TW',
        internationalDialing: '+886',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '213',
        country: 'Tajikistan (Former Tajik Soviet Socialist Republic)',
        countryCode: 'TJ',
        internationalDialing: '+992',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '214',
        country: 'Tanzania, United Republic of (Former United Republic of Tanganyika and Zanzibar)',
        countryCode: 'TZ',
        internationalDialing: '+255',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '215',
        country: 'Thailand (Former Siam)',
        countryCode: 'TH',
        internationalDialing: '+66',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '216',
        country: 'Togo (Former French Togoland)',
        countryCode: 'TG',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '217',
        country: 'Tokelau',
        countryCode: 'TK',
        internationalDialing: '+690',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '218',
        country: 'Tonga, Kingdom of (Former Friendly Islands)',
        countryCode: 'TO',
        internationalDialing: '+676',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '219',
        country: 'Trinidad and Tobago',
        countryCode: 'TT',
        internationalDialing: '+1-868',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '220',
        country: 'Tromelin Island',
        countryCode: 'TE',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '221',
        country: 'Tunisia',
        countryCode: 'TN',
        internationalDialing: '+216',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '222',
        country: 'Turkey',
        countryCode: 'TR',
        internationalDialing: '+90',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '223',
        country: 'Turkmenistan (Former Turkmen Soviet Socialist Republic)',
        countryCode: 'TM',
        internationalDialing: '+993',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '224',
        country: 'Turks and Caicos Islands',
        countryCode: 'TC',
        internationalDialing: '+1-649',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '225',
        country: 'Tuvalu (Former Ellice Islands)',
        countryCode: 'TV',
        internationalDialing: '+688',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '226',
        country: 'Uganda, Republic of',
        countryCode: 'UG',
        internationalDialing: '+256',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '227',
        country:
          'Ukraine (Former Ukrainian National Republic, Ukrainian State, Ukrainian Soviet Socialist Republic)',
        countryCode: 'UA',
        internationalDialing: '+380',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '228',
        country: 'United Arab Emirates (UAE) (Former Trucial Oman, Trucial States)',
        countryCode: 'AE',
        internationalDialing: '+971',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '229',
        country: 'United Kingdom (Great Britain / UK)',
        countryCode: 'GB',
        internationalDialing: '+44',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '230',
        country: 'United States',
        countryCode: 'US',
        internationalDialing: '+1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '231',
        country: 'United States Minor Outlying Islands',
        countryCode: 'UM',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '232',
        country: 'Uruguay, Oriental Republic of (Former Banda Oriental, Cisplatine Province)',
        countryCode: 'UY',
        internationalDialing: '+598',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '233',
        country: 'Uzbekistan (Former UZbek Soviet Socialist Republic)',
        countryCode: 'UZ',
        internationalDialing: '+998',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '234',
        country: 'Vanuatu (Former New Hebrides)',
        countryCode: 'VU',
        internationalDialing: '+678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '235',
        country: 'Vatican City State (Holy See)',
        countryCode: 'VA',
        internationalDialing: '+418',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '236',
        country: 'Venezuela',
        countryCode: 'VE',
        internationalDialing: '+58',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '237',
        country: 'Vietnam',
        countryCode: 'VN',
        internationalDialing: '+84',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '238',
        country: 'Virgin Islands, British',
        countryCode: 'VI',
        internationalDialing: '+1-284',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '239',
        country: 'Virgin Islands, United States (Former Danish West Indies)',
        countryCode: 'VQ',
        internationalDialing: '+1-340',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '240',
        country: 'Wallis and Futuna Islands',
        countryCode: 'WF',
        internationalDialing: '+681',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '241',
        country: 'Western Sahara (Former Spanish Sahara)',
        countryCode: 'EH',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '242',
        country: 'Yemen',
        countryCode: 'YE',
        internationalDialing: '+967',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '243',
        country: 'Yugoslavia',
        countryCode: 'YU',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '244',
        country:
          'Zaire (Former Congo Free State, Belgian Congo, Congo/Leopoldville, Congo/Kinshasa, Zaire) Now CD - Congo, Democratic Republic of the',
        countryCode: 'ZR',
        internationalDialing: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '245',
        country: 'Zambia, Republic of (Former Northern Rhodesia)',
        countryCode: 'ZM',
        internationalDialing: '+260',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '246',
        country: 'Zimbabwe, Republic of (Former Southern Rhodesia, Rhodesia)',
        countryCode: 'ZW',
        internationalDialing: '+263',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  ]
};
