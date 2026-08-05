export interface ColombianCity {
  value: string;
  label: string;
  /** Código DIVIPOLA del municipio (DANE), por si se necesita correlacionar con otras fuentes oficiales. */
  code: string;
}

export interface ColombianDepartment {
  value: string;
  label: string;
  /** Código DIVIPOLA del departamento (DANE). */
  code: string;
  cities: ColombianCity[];
}

/**
 * División político-administrativa completa de Colombia (DIVIPOLA / DANE):
 * 33 departamentos (incluye Bogotá D.C.) y 1121 municipios.
 *
 * Fuente: dataset DIVIPOLA (https://www.npmjs.com/package/divipola, licencia MIT),
 * basado en la división política oficial del DANE. Es información estática que
 * casi no cambia — se mantiene como dataset local en vez de llamar un servicio
 * externo en cada carga de formulario (ver decisión arquitectónica del chat).
 */
export const COLOMBIA_DEPARTMENTS: ColombianDepartment[] = [
  {
    value: 'amazonas',
    label: 'Amazonas',
    code: '91',
    cities: [
      {
        value: 'el_encanto_amazonas',
        label: 'El Encanto',
        code: '91263',
      },
      {
        value: 'la_chorrera_amazonas',
        label: 'La Chorrera',
        code: '91405',
      },
      {
        value: 'la_pedrera_amazonas',
        label: 'La Pedrera',
        code: '91407',
      },
      {
        value: 'la_victoria_amazonas',
        label: 'La Victoria',
        code: '91430',
      },
      {
        value: 'leticia_amazonas',
        label: 'Leticia',
        code: '91001',
      },
      {
        value: 'miriti_parana_amazonas',
        label: 'Mirití – Paraná',
        code: '91460',
      },
      {
        value: 'puerto_alegria_amazonas',
        label: 'Puerto Alegría',
        code: '91530',
      },
      {
        value: 'puerto_arica_amazonas',
        label: 'Puerto Arica',
        code: '91536',
      },
      {
        value: 'puerto_narino_amazonas',
        label: 'Puerto Nariño',
        code: '91540',
      },
      {
        value: 'puerto_santander_amazonas',
        label: 'Puerto Santander',
        code: '91669',
      },
      {
        value: 'tarapaca_amazonas',
        label: 'Tarapacá',
        code: '91798',
      },
    ],
  },
  {
    value: 'antioquia',
    label: 'Antioquia',
    code: '05',
    cities: [
      {
        value: 'abejorral_antioquia',
        label: 'Abejorral',
        code: '05002',
      },
      {
        value: 'abriaqui_antioquia',
        label: 'Abriaquí',
        code: '05004',
      },
      {
        value: 'alejandria_antioquia',
        label: 'Alejandría',
        code: '05021',
      },
      {
        value: 'amaga_antioquia',
        label: 'Amagá',
        code: '05030',
      },
      {
        value: 'amalfi_antioquia',
        label: 'Amalfi',
        code: '05031',
      },
      {
        value: 'andes_antioquia',
        label: 'Andes',
        code: '05034',
      },
      {
        value: 'angelopolis_antioquia',
        label: 'Angelópolis',
        code: '05036',
      },
      {
        value: 'angostura_antioquia',
        label: 'Angostura',
        code: '05038',
      },
      {
        value: 'anori_antioquia',
        label: 'Anorí',
        code: '05040',
      },
      {
        value: 'anza_antioquia',
        label: 'Anzá',
        code: '05044',
      },
      {
        value: 'apartado_antioquia',
        label: 'Apartadó',
        code: '05045',
      },
      {
        value: 'arboletes_antioquia',
        label: 'Arboletes',
        code: '05051',
      },
      {
        value: 'argelia_antioquia',
        label: 'Argelia',
        code: '05055',
      },
      {
        value: 'armenia_antioquia',
        label: 'Armenia',
        code: '05059',
      },
      {
        value: 'barbosa_antioquia',
        label: 'Barbosa',
        code: '05079',
      },
      {
        value: 'bello_antioquia',
        label: 'Bello',
        code: '05088',
      },
      {
        value: 'belmira_antioquia',
        label: 'Belmira',
        code: '05086',
      },
      {
        value: 'betania_antioquia',
        label: 'Betania',
        code: '05091',
      },
      {
        value: 'betulia_antioquia',
        label: 'Betulia',
        code: '05093',
      },
      {
        value: 'briceno_antioquia',
        label: 'Briceño',
        code: '05107',
      },
      {
        value: 'buritica_antioquia',
        label: 'Buriticá',
        code: '05113',
      },
      {
        value: 'caceres_antioquia',
        label: 'Cáceres',
        code: '05120',
      },
      {
        value: 'caicedo_antioquia',
        label: 'Caicedo',
        code: '05125',
      },
      {
        value: 'caldas_antioquia',
        label: 'Caldas',
        code: '05129',
      },
      {
        value: 'campamento_antioquia',
        label: 'Campamento',
        code: '05134',
      },
      {
        value: 'canasgordas_antioquia',
        label: 'Cañasgordas',
        code: '05138',
      },
      {
        value: 'caracoli_antioquia',
        label: 'Caracolí',
        code: '05142',
      },
      {
        value: 'caramanta_antioquia',
        label: 'Caramanta',
        code: '05145',
      },
      {
        value: 'carepa_antioquia',
        label: 'Carepa',
        code: '05147',
      },
      {
        value: 'carolina_antioquia',
        label: 'Carolina',
        code: '05150',
      },
      {
        value: 'caucasia_antioquia',
        label: 'Caucasia',
        code: '05154',
      },
      {
        value: 'chigorodo_antioquia',
        label: 'Chigorodó',
        code: '05172',
      },
      {
        value: 'cisneros_antioquia',
        label: 'Cisneros',
        code: '05190',
      },
      {
        value: 'ciudad_bolivar_antioquia',
        label: 'Ciudad Bolívar',
        code: '05101',
      },
      {
        value: 'cocorna_antioquia',
        label: 'Cocorná',
        code: '05197',
      },
      {
        value: 'concepcion_antioquia',
        label: 'Concepción',
        code: '05206',
      },
      {
        value: 'concordia_antioquia',
        label: 'Concordia',
        code: '05209',
      },
      {
        value: 'copacabana_antioquia',
        label: 'Copacabana',
        code: '05212',
      },
      {
        value: 'dabeiba_antioquia',
        label: 'Dabeiba',
        code: '05234',
      },
      {
        value: 'donmatias_antioquia',
        label: 'Donmatías',
        code: '05237',
      },
      {
        value: 'ebejico_antioquia',
        label: 'Ebéjico',
        code: '05240',
      },
      {
        value: 'el_bagre_antioquia',
        label: 'El Bagre',
        code: '05250',
      },
      {
        value: 'el_carmen_de_viboral_antioquia',
        label: 'El Carmen De Viboral',
        code: '05148',
      },
      {
        value: 'el_santuario_antioquia',
        label: 'El Santuario',
        code: '05697',
      },
      {
        value: 'entrerrios_antioquia',
        label: 'Entrerríos',
        code: '05264',
      },
      {
        value: 'envigado_antioquia',
        label: 'Envigado',
        code: '05266',
      },
      {
        value: 'fredonia_antioquia',
        label: 'Fredonia',
        code: '05282',
      },
      {
        value: 'frontino_antioquia',
        label: 'Frontino',
        code: '05284',
      },
      {
        value: 'giraldo_antioquia',
        label: 'Giraldo',
        code: '05306',
      },
      {
        value: 'girardota_antioquia',
        label: 'Girardota',
        code: '05308',
      },
      {
        value: 'gomez_plata_antioquia',
        label: 'Gómez Plata',
        code: '05310',
      },
      {
        value: 'granada_antioquia',
        label: 'Granada',
        code: '05313',
      },
      {
        value: 'guadalupe_antioquia',
        label: 'Guadalupe',
        code: '05315',
      },
      {
        value: 'guarne_antioquia',
        label: 'Guarne',
        code: '05318',
      },
      {
        value: 'guatape_antioquia',
        label: 'Guatapé',
        code: '05321',
      },
      {
        value: 'heliconia_antioquia',
        label: 'Heliconia',
        code: '05347',
      },
      {
        value: 'hispania_antioquia',
        label: 'Hispania',
        code: '05353',
      },
      {
        value: 'itagui_antioquia',
        label: 'Itagüí',
        code: '05360',
      },
      {
        value: 'ituango_antioquia',
        label: 'Ituango',
        code: '05361',
      },
      {
        value: 'jardin_antioquia',
        label: 'Jardín',
        code: '05364',
      },
      {
        value: 'jerico_antioquia',
        label: 'Jericó',
        code: '05368',
      },
      {
        value: 'la_ceja_antioquia',
        label: 'La Ceja',
        code: '05376',
      },
      {
        value: 'la_estrella_antioquia',
        label: 'La Estrella',
        code: '05380',
      },
      {
        value: 'la_pintada_antioquia',
        label: 'La Pintada',
        code: '05390',
      },
      {
        value: 'la_union_antioquia',
        label: 'La Unión',
        code: '05400',
      },
      {
        value: 'liborina_antioquia',
        label: 'Liborina',
        code: '05411',
      },
      {
        value: 'maceo_antioquia',
        label: 'Maceo',
        code: '05425',
      },
      {
        value: 'marinilla_antioquia',
        label: 'Marinilla',
        code: '05440',
      },
      {
        value: 'medellin_antioquia',
        label: 'Medellín',
        code: '05001',
      },
      {
        value: 'montebello_antioquia',
        label: 'Montebello',
        code: '05467',
      },
      {
        value: 'murindo_antioquia',
        label: 'Murindó',
        code: '05475',
      },
      {
        value: 'mutata_antioquia',
        label: 'Mutatá',
        code: '05480',
      },
      {
        value: 'narino_antioquia',
        label: 'Nariño',
        code: '05483',
      },
      {
        value: 'nechi_antioquia',
        label: 'Nechí',
        code: '05495',
      },
      {
        value: 'necocli_antioquia',
        label: 'Necoclí',
        code: '05490',
      },
      {
        value: 'olaya_antioquia',
        label: 'Olaya',
        code: '05501',
      },
      {
        value: 'penol_antioquia',
        label: 'Peñol',
        code: '05541',
      },
      {
        value: 'peque_antioquia',
        label: 'Peque',
        code: '05543',
      },
      {
        value: 'pueblorrico_antioquia',
        label: 'Pueblorrico',
        code: '05576',
      },
      {
        value: 'puerto_berrio_antioquia',
        label: 'Puerto Berrío',
        code: '05579',
      },
      {
        value: 'puerto_nare_antioquia',
        label: 'Puerto Nare',
        code: '05585',
      },
      {
        value: 'puerto_triunfo_antioquia',
        label: 'Puerto Triunfo',
        code: '05591',
      },
      {
        value: 'remedios_antioquia',
        label: 'Remedios',
        code: '05604',
      },
      {
        value: 'retiro_antioquia',
        label: 'Retiro',
        code: '05607',
      },
      {
        value: 'rionegro_antioquia',
        label: 'Rionegro',
        code: '05615',
      },
      {
        value: 'sabanalarga_antioquia',
        label: 'Sabanalarga',
        code: '05628',
      },
      {
        value: 'sabaneta_antioquia',
        label: 'Sabaneta',
        code: '05631',
      },
      {
        value: 'salgar_antioquia',
        label: 'Salgar',
        code: '05642',
      },
      {
        value: 'san_andres_de_cuerquia_antioquia',
        label: 'San Andrés De Cuerquía',
        code: '05647',
      },
      {
        value: 'san_carlos_antioquia',
        label: 'San Carlos',
        code: '05649',
      },
      {
        value: 'san_francisco_antioquia',
        label: 'San Francisco',
        code: '05652',
      },
      {
        value: 'san_jeronimo_antioquia',
        label: 'San Jerónimo',
        code: '05656',
      },
      {
        value: 'san_jose_de_la_montana_antioquia',
        label: 'San José De La Montaña',
        code: '05658',
      },
      {
        value: 'san_juan_de_uraba_antioquia',
        label: 'San Juan De Urabá',
        code: '05659',
      },
      {
        value: 'san_luis_antioquia',
        label: 'San Luis',
        code: '05660',
      },
      {
        value: 'san_pedro_de_los_milagros_antioquia',
        label: 'San Pedro De Los Milagros',
        code: '05664',
      },
      {
        value: 'san_pedro_de_uraba_antioquia',
        label: 'San Pedro De Urabá',
        code: '05665',
      },
      {
        value: 'san_rafael_antioquia',
        label: 'San Rafael',
        code: '05667',
      },
      {
        value: 'san_roque_antioquia',
        label: 'San Roque',
        code: '05670',
      },
      {
        value: 'san_vicente_ferrer_antioquia',
        label: 'San Vicente Ferrer',
        code: '05674',
      },
      {
        value: 'santa_barbara_antioquia',
        label: 'Santa Bárbara',
        code: '05679',
      },
      {
        value: 'santa_fe_de_antioquia_antioquia',
        label: 'Santa Fé De Antioquia',
        code: '05042',
      },
      {
        value: 'santa_rosa_de_osos_antioquia',
        label: 'Santa Rosa De Osos',
        code: '05686',
      },
      {
        value: 'santo_domingo_antioquia',
        label: 'Santo Domingo',
        code: '05690',
      },
      {
        value: 'segovia_antioquia',
        label: 'Segovia',
        code: '05736',
      },
      {
        value: 'sonson_antioquia',
        label: 'Sonsón',
        code: '05756',
      },
      {
        value: 'sopetran_antioquia',
        label: 'Sopetrán',
        code: '05761',
      },
      {
        value: 'tamesis_antioquia',
        label: 'Támesis',
        code: '05789',
      },
      {
        value: 'taraza_antioquia',
        label: 'Tarazá',
        code: '05790',
      },
      {
        value: 'tarso_antioquia',
        label: 'Tarso',
        code: '05792',
      },
      {
        value: 'titiribi_antioquia',
        label: 'Titiribí',
        code: '05809',
      },
      {
        value: 'toledo_antioquia',
        label: 'Toledo',
        code: '05819',
      },
      {
        value: 'turbo_antioquia',
        label: 'Turbo',
        code: '05837',
      },
      {
        value: 'uramita_antioquia',
        label: 'Uramita',
        code: '05842',
      },
      {
        value: 'urrao_antioquia',
        label: 'Urrao',
        code: '05847',
      },
      {
        value: 'valdivia_antioquia',
        label: 'Valdivia',
        code: '05854',
      },
      {
        value: 'valparaiso_antioquia',
        label: 'Valparaíso',
        code: '05856',
      },
      {
        value: 'vegachi_antioquia',
        label: 'Vegachí',
        code: '05858',
      },
      {
        value: 'venecia_antioquia',
        label: 'Venecia',
        code: '05861',
      },
      {
        value: 'vigia_del_fuerte_antioquia',
        label: 'Vigía Del Fuerte',
        code: '05873',
      },
      {
        value: 'yali_antioquia',
        label: 'Yalí',
        code: '05885',
      },
      {
        value: 'yarumal_antioquia',
        label: 'Yarumal',
        code: '05887',
      },
      {
        value: 'yolombo_antioquia',
        label: 'Yolombó',
        code: '05890',
      },
      {
        value: 'yondo_antioquia',
        label: 'Yondó',
        code: '05893',
      },
      {
        value: 'zaragoza_antioquia',
        label: 'Zaragoza',
        code: '05895',
      },
    ],
  },
  {
    value: 'arauca',
    label: 'Arauca',
    code: '81',
    cities: [
      {
        value: 'arauca_arauca',
        label: 'Arauca',
        code: '81001',
      },
      {
        value: 'arauquita_arauca',
        label: 'Arauquita',
        code: '81065',
      },
      {
        value: 'cravo_norte_arauca',
        label: 'Cravo Norte',
        code: '81220',
      },
      {
        value: 'fortul_arauca',
        label: 'Fortul',
        code: '81300',
      },
      {
        value: 'puerto_rondon_arauca',
        label: 'Puerto Rondón',
        code: '81591',
      },
      {
        value: 'saravena_arauca',
        label: 'Saravena',
        code: '81736',
      },
      {
        value: 'tame_arauca',
        label: 'Tame',
        code: '81794',
      },
    ],
  },
  {
    value: 'atlantico',
    label: 'Atlántico',
    code: '08',
    cities: [
      {
        value: 'baranoa_atlantico',
        label: 'Baranoa',
        code: '08078',
      },
      {
        value: 'barranquilla_atlantico',
        label: 'Barranquilla',
        code: '08001',
      },
      {
        value: 'campo_de_la_cruz_atlantico',
        label: 'Campo De La Cruz',
        code: '08137',
      },
      {
        value: 'candelaria_atlantico',
        label: 'Candelaria',
        code: '08141',
      },
      {
        value: 'galapa_atlantico',
        label: 'Galapa',
        code: '08296',
      },
      {
        value: 'juan_de_acosta_atlantico',
        label: 'Juan De Acosta',
        code: '08372',
      },
      {
        value: 'luruaco_atlantico',
        label: 'Luruaco',
        code: '08421',
      },
      {
        value: 'malambo_atlantico',
        label: 'Malambo',
        code: '08433',
      },
      {
        value: 'manati_atlantico',
        label: 'Manatí',
        code: '08436',
      },
      {
        value: 'palmar_de_varela_atlantico',
        label: 'Palmar De Varela',
        code: '08520',
      },
      {
        value: 'piojo_atlantico',
        label: 'Piojó',
        code: '08549',
      },
      {
        value: 'polonuevo_atlantico',
        label: 'Polonuevo',
        code: '08558',
      },
      {
        value: 'ponedera_atlantico',
        label: 'Ponedera',
        code: '08560',
      },
      {
        value: 'puerto_colombia_atlantico',
        label: 'Puerto Colombia',
        code: '08573',
      },
      {
        value: 'repelon_atlantico',
        label: 'Repelón',
        code: '08606',
      },
      {
        value: 'sabanagrande_atlantico',
        label: 'Sabanagrande',
        code: '08634',
      },
      {
        value: 'sabanalarga_atlantico',
        label: 'Sabanalarga',
        code: '08638',
      },
      {
        value: 'santa_lucia_atlantico',
        label: 'Santa Lucía',
        code: '08675',
      },
      {
        value: 'santo_tomas_atlantico',
        label: 'Santo Tomás',
        code: '08685',
      },
      {
        value: 'soledad_atlantico',
        label: 'Soledad',
        code: '08758',
      },
      {
        value: 'suan_atlantico',
        label: 'Suan',
        code: '08770',
      },
      {
        value: 'tubara_atlantico',
        label: 'Tubará',
        code: '08832',
      },
      {
        value: 'usiacuri_atlantico',
        label: 'Usiacurí',
        code: '08849',
      },
    ],
  },
  {
    value: 'bogota_dc',
    label: 'Bogotá D.C.',
    code: '11',
    cities: [
      {
        value: 'bogota_dc_bogota_dc',
        label: 'Bogotá. D.c.',
        code: '11001',
      },
    ],
  },
  {
    value: 'bolivar',
    label: 'Bolívar',
    code: '13',
    cities: [
      {
        value: 'achi_bolivar',
        label: 'Achí',
        code: '13006',
      },
      {
        value: 'altos_del_rosario_bolivar',
        label: 'Altos Del Rosario',
        code: '13030',
      },
      {
        value: 'arenal_bolivar',
        label: 'Arenal',
        code: '13042',
      },
      {
        value: 'arjona_bolivar',
        label: 'Arjona',
        code: '13052',
      },
      {
        value: 'arroyohondo_bolivar',
        label: 'Arroyohondo',
        code: '13062',
      },
      {
        value: 'barranco_de_loba_bolivar',
        label: 'Barranco De Loba',
        code: '13074',
      },
      {
        value: 'calamar_bolivar',
        label: 'Calamar',
        code: '13140',
      },
      {
        value: 'cantagallo_bolivar',
        label: 'Cantagallo',
        code: '13160',
      },
      {
        value: 'cartagena_de_indias_bolivar',
        label: 'Cartagena De Indias',
        code: '13001',
      },
      {
        value: 'cicuco_bolivar',
        label: 'Cicuco',
        code: '13188',
      },
      {
        value: 'clemencia_bolivar',
        label: 'Clemencia',
        code: '13222',
      },
      {
        value: 'cordoba_bolivar',
        label: 'Córdoba',
        code: '13212',
      },
      {
        value: 'el_carmen_de_bolivar_bolivar',
        label: 'El Carmen De Bolívar',
        code: '13244',
      },
      {
        value: 'el_guamo_bolivar',
        label: 'El Guamo',
        code: '13248',
      },
      {
        value: 'el_penon_bolivar',
        label: 'El Peñón',
        code: '13268',
      },
      {
        value: 'hatillo_de_loba_bolivar',
        label: 'Hatillo De Loba',
        code: '13300',
      },
      {
        value: 'magangue_bolivar',
        label: 'Magangué',
        code: '13430',
      },
      {
        value: 'mahates_bolivar',
        label: 'Mahates',
        code: '13433',
      },
      {
        value: 'margarita_bolivar',
        label: 'Margarita',
        code: '13440',
      },
      {
        value: 'maria_la_baja_bolivar',
        label: 'María La Baja',
        code: '13442',
      },
      {
        value: 'montecristo_bolivar',
        label: 'Montecristo',
        code: '13458',
      },
      {
        value: 'morales_bolivar',
        label: 'Morales',
        code: '13473',
      },
      {
        value: 'norosi_bolivar',
        label: 'Norosí',
        code: '13490',
      },
      {
        value: 'pinillos_bolivar',
        label: 'Pinillos',
        code: '13549',
      },
      {
        value: 'regidor_bolivar',
        label: 'Regidor',
        code: '13580',
      },
      {
        value: 'rio_viejo_bolivar',
        label: 'Río Viejo',
        code: '13600',
      },
      {
        value: 'san_cristobal_bolivar',
        label: 'San Cristóbal',
        code: '13620',
      },
      {
        value: 'san_estanislao_bolivar',
        label: 'San Estanislao',
        code: '13647',
      },
      {
        value: 'san_fernando_bolivar',
        label: 'San Fernando',
        code: '13650',
      },
      {
        value: 'san_jacinto_bolivar',
        label: 'San Jacinto',
        code: '13654',
      },
      {
        value: 'san_jacinto_del_cauca_bolivar',
        label: 'San Jacinto Del Cauca',
        code: '13655',
      },
      {
        value: 'san_juan_nepomuceno_bolivar',
        label: 'San Juan Nepomuceno',
        code: '13657',
      },
      {
        value: 'san_martin_de_loba_bolivar',
        label: 'San Martín De Loba',
        code: '13667',
      },
      {
        value: 'san_pablo_bolivar',
        label: 'San Pablo',
        code: '13670',
      },
      {
        value: 'santa_catalina_bolivar',
        label: 'Santa Catalina',
        code: '13673',
      },
      {
        value: 'santa_cruz_de_mompox_bolivar',
        label: 'Santa Cruz De Mompox',
        code: '13468',
      },
      {
        value: 'santa_rosa_bolivar',
        label: 'Santa Rosa',
        code: '13683',
      },
      {
        value: 'santa_rosa_del_sur_bolivar',
        label: 'Santa Rosa Del Sur',
        code: '13688',
      },
      {
        value: 'simiti_bolivar',
        label: 'Simití',
        code: '13744',
      },
      {
        value: 'soplaviento_bolivar',
        label: 'Soplaviento',
        code: '13760',
      },
      {
        value: 'talaigua_nuevo_bolivar',
        label: 'Talaigua Nuevo',
        code: '13780',
      },
      {
        value: 'tiquisio_bolivar',
        label: 'Tiquisio',
        code: '13810',
      },
      {
        value: 'turbaco_bolivar',
        label: 'Turbaco',
        code: '13836',
      },
      {
        value: 'turbana_bolivar',
        label: 'Turbaná',
        code: '13838',
      },
      {
        value: 'villanueva_bolivar',
        label: 'Villanueva',
        code: '13873',
      },
      {
        value: 'zambrano_bolivar',
        label: 'Zambrano',
        code: '13894',
      },
    ],
  },
  {
    value: 'boyaca',
    label: 'Boyacá',
    code: '15',
    cities: [
      {
        value: 'almeida_boyaca',
        label: 'Almeida',
        code: '15022',
      },
      {
        value: 'aquitania_boyaca',
        label: 'Aquitania',
        code: '15047',
      },
      {
        value: 'arcabuco_boyaca',
        label: 'Arcabuco',
        code: '15051',
      },
      {
        value: 'belen_boyaca',
        label: 'Belén',
        code: '15087',
      },
      {
        value: 'berbeo_boyaca',
        label: 'Berbeo',
        code: '15090',
      },
      {
        value: 'beteitiva_boyaca',
        label: 'Betéitiva',
        code: '15092',
      },
      {
        value: 'boavita_boyaca',
        label: 'Boavita',
        code: '15097',
      },
      {
        value: 'boyaca_boyaca',
        label: 'Boyacá',
        code: '15104',
      },
      {
        value: 'briceno_boyaca',
        label: 'Briceño',
        code: '15106',
      },
      {
        value: 'buenavista_boyaca',
        label: 'Buenavista',
        code: '15109',
      },
      {
        value: 'busbanza_boyaca',
        label: 'Busbanzá',
        code: '15114',
      },
      {
        value: 'caldas_boyaca',
        label: 'Caldas',
        code: '15131',
      },
      {
        value: 'campohermoso_boyaca',
        label: 'Campohermoso',
        code: '15135',
      },
      {
        value: 'cerinza_boyaca',
        label: 'Cerinza',
        code: '15162',
      },
      {
        value: 'chinavita_boyaca',
        label: 'Chinavita',
        code: '15172',
      },
      {
        value: 'chiquinquira_boyaca',
        label: 'Chiquinquirá',
        code: '15176',
      },
      {
        value: 'chiquiza_boyaca',
        label: 'Chíquiza',
        code: '15232',
      },
      {
        value: 'chiscas_boyaca',
        label: 'Chiscas',
        code: '15180',
      },
      {
        value: 'chita_boyaca',
        label: 'Chita',
        code: '15183',
      },
      {
        value: 'chitaraque_boyaca',
        label: 'Chitaraque',
        code: '15185',
      },
      {
        value: 'chivata_boyaca',
        label: 'Chivatá',
        code: '15187',
      },
      {
        value: 'chivor_boyaca',
        label: 'Chivor',
        code: '15236',
      },
      {
        value: 'cienega_boyaca',
        label: 'Ciénega',
        code: '15189',
      },
      {
        value: 'combita_boyaca',
        label: 'Cómbita',
        code: '15204',
      },
      {
        value: 'coper_boyaca',
        label: 'Coper',
        code: '15212',
      },
      {
        value: 'corrales_boyaca',
        label: 'Corrales',
        code: '15215',
      },
      {
        value: 'covarachia_boyaca',
        label: 'Covarachía',
        code: '15218',
      },
      {
        value: 'cubara_boyaca',
        label: 'Cubará',
        code: '15223',
      },
      {
        value: 'cucaita_boyaca',
        label: 'Cucaita',
        code: '15224',
      },
      {
        value: 'cuitiva_boyaca',
        label: 'Cuítiva',
        code: '15226',
      },
      {
        value: 'duitama_boyaca',
        label: 'Duitama',
        code: '15238',
      },
      {
        value: 'el_cocuy_boyaca',
        label: 'El Cocuy',
        code: '15244',
      },
      {
        value: 'el_espino_boyaca',
        label: 'El Espino',
        code: '15248',
      },
      {
        value: 'firavitoba_boyaca',
        label: 'Firavitoba',
        code: '15272',
      },
      {
        value: 'floresta_boyaca',
        label: 'Floresta',
        code: '15276',
      },
      {
        value: 'gachantiva_boyaca',
        label: 'Gachantivá',
        code: '15293',
      },
      {
        value: 'gameza_boyaca',
        label: 'Gámeza',
        code: '15296',
      },
      {
        value: 'garagoa_boyaca',
        label: 'Garagoa',
        code: '15299',
      },
      {
        value: 'guacamayas_boyaca',
        label: 'Guacamayas',
        code: '15317',
      },
      {
        value: 'guateque_boyaca',
        label: 'Guateque',
        code: '15322',
      },
      {
        value: 'guayata_boyaca',
        label: 'Guayatá',
        code: '15325',
      },
      {
        value: 'guican_de_la_sierra_boyaca',
        label: 'Güicán De La Sierra',
        code: '15332',
      },
      {
        value: 'iza_boyaca',
        label: 'Iza',
        code: '15362',
      },
      {
        value: 'jenesano_boyaca',
        label: 'Jenesano',
        code: '15367',
      },
      {
        value: 'jerico_boyaca',
        label: 'Jericó',
        code: '15368',
      },
      {
        value: 'la_capilla_boyaca',
        label: 'La Capilla',
        code: '15380',
      },
      {
        value: 'la_uvita_boyaca',
        label: 'La Uvita',
        code: '15403',
      },
      {
        value: 'la_victoria_boyaca',
        label: 'La Victoria',
        code: '15401',
      },
      {
        value: 'labranzagrande_boyaca',
        label: 'Labranzagrande',
        code: '15377',
      },
      {
        value: 'macanal_boyaca',
        label: 'Macanal',
        code: '15425',
      },
      {
        value: 'maripi_boyaca',
        label: 'Maripí',
        code: '15442',
      },
      {
        value: 'miraflores_boyaca',
        label: 'Miraflores',
        code: '15455',
      },
      {
        value: 'mongua_boyaca',
        label: 'Mongua',
        code: '15464',
      },
      {
        value: 'mongui_boyaca',
        label: 'Monguí',
        code: '15466',
      },
      {
        value: 'moniquira_boyaca',
        label: 'Moniquirá',
        code: '15469',
      },
      {
        value: 'motavita_boyaca',
        label: 'Motavita',
        code: '15476',
      },
      {
        value: 'muzo_boyaca',
        label: 'Muzo',
        code: '15480',
      },
      {
        value: 'nobsa_boyaca',
        label: 'Nobsa',
        code: '15491',
      },
      {
        value: 'nuevo_colon_boyaca',
        label: 'Nuevo Colón',
        code: '15494',
      },
      {
        value: 'oicata_boyaca',
        label: 'Oicatá',
        code: '15500',
      },
      {
        value: 'otanche_boyaca',
        label: 'Otanche',
        code: '15507',
      },
      {
        value: 'pachavita_boyaca',
        label: 'Pachavita',
        code: '15511',
      },
      {
        value: 'paez_boyaca',
        label: 'Páez',
        code: '15514',
      },
      {
        value: 'paipa_boyaca',
        label: 'Paipa',
        code: '15516',
      },
      {
        value: 'pajarito_boyaca',
        label: 'Pajarito',
        code: '15518',
      },
      {
        value: 'panqueba_boyaca',
        label: 'Panqueba',
        code: '15522',
      },
      {
        value: 'pauna_boyaca',
        label: 'Pauna',
        code: '15531',
      },
      {
        value: 'paya_boyaca',
        label: 'Paya',
        code: '15533',
      },
      {
        value: 'paz_de_rio_boyaca',
        label: 'Paz De Río',
        code: '15537',
      },
      {
        value: 'pesca_boyaca',
        label: 'Pesca',
        code: '15542',
      },
      {
        value: 'pisba_boyaca',
        label: 'Pisba',
        code: '15550',
      },
      {
        value: 'puerto_boyaca_boyaca',
        label: 'Puerto Boyacá',
        code: '15572',
      },
      {
        value: 'quipama_boyaca',
        label: 'Quípama',
        code: '15580',
      },
      {
        value: 'ramiriqui_boyaca',
        label: 'Ramiriquí',
        code: '15599',
      },
      {
        value: 'raquira_boyaca',
        label: 'Ráquira',
        code: '15600',
      },
      {
        value: 'rondon_boyaca',
        label: 'Rondón',
        code: '15621',
      },
      {
        value: 'saboya_boyaca',
        label: 'Saboyá',
        code: '15632',
      },
      {
        value: 'sachica_boyaca',
        label: 'Sáchica',
        code: '15638',
      },
      {
        value: 'samaca_boyaca',
        label: 'Samacá',
        code: '15646',
      },
      {
        value: 'san_eduardo_boyaca',
        label: 'San Eduardo',
        code: '15660',
      },
      {
        value: 'san_jose_de_pare_boyaca',
        label: 'San José De Pare',
        code: '15664',
      },
      {
        value: 'san_luis_de_gaceno_boyaca',
        label: 'San Luis De Gaceno',
        code: '15667',
      },
      {
        value: 'san_mateo_boyaca',
        label: 'San Mateo',
        code: '15673',
      },
      {
        value: 'san_miguel_de_sema_boyaca',
        label: 'San Miguel De Sema',
        code: '15676',
      },
      {
        value: 'san_pablo_de_borbur_boyaca',
        label: 'San Pablo De Borbur',
        code: '15681',
      },
      {
        value: 'santa_maria_boyaca',
        label: 'Santa María',
        code: '15690',
      },
      {
        value: 'santa_rosa_de_viterbo_boyaca',
        label: 'Santa Rosa De Viterbo',
        code: '15693',
      },
      {
        value: 'santa_sofia_boyaca',
        label: 'Santa Sofía',
        code: '15696',
      },
      {
        value: 'santana_boyaca',
        label: 'Santana',
        code: '15686',
      },
      {
        value: 'sativanorte_boyaca',
        label: 'Sativanorte',
        code: '15720',
      },
      {
        value: 'sativasur_boyaca',
        label: 'Sativasur',
        code: '15723',
      },
      {
        value: 'siachoque_boyaca',
        label: 'Siachoque',
        code: '15740',
      },
      {
        value: 'soata_boyaca',
        label: 'Soatá',
        code: '15753',
      },
      {
        value: 'socha_boyaca',
        label: 'Socha',
        code: '15757',
      },
      {
        value: 'socota_boyaca',
        label: 'Socotá',
        code: '15755',
      },
      {
        value: 'sogamoso_boyaca',
        label: 'Sogamoso',
        code: '15759',
      },
      {
        value: 'somondoco_boyaca',
        label: 'Somondoco',
        code: '15761',
      },
      {
        value: 'sora_boyaca',
        label: 'Sora',
        code: '15762',
      },
      {
        value: 'soraca_boyaca',
        label: 'Soracá',
        code: '15764',
      },
      {
        value: 'sotaquira_boyaca',
        label: 'Sotaquirá',
        code: '15763',
      },
      {
        value: 'susacon_boyaca',
        label: 'Susacón',
        code: '15774',
      },
      {
        value: 'sutamarchan_boyaca',
        label: 'Sutamarchán',
        code: '15776',
      },
      {
        value: 'sutatenza_boyaca',
        label: 'Sutatenza',
        code: '15778',
      },
      {
        value: 'tasco_boyaca',
        label: 'Tasco',
        code: '15790',
      },
      {
        value: 'tenza_boyaca',
        label: 'Tenza',
        code: '15798',
      },
      {
        value: 'tibana_boyaca',
        label: 'Tibaná',
        code: '15804',
      },
      {
        value: 'tibasosa_boyaca',
        label: 'Tibasosa',
        code: '15806',
      },
      {
        value: 'tinjaca_boyaca',
        label: 'Tinjacá',
        code: '15808',
      },
      {
        value: 'tipacoque_boyaca',
        label: 'Tipacoque',
        code: '15810',
      },
      {
        value: 'toca_boyaca',
        label: 'Toca',
        code: '15814',
      },
      {
        value: 'togui_boyaca',
        label: 'Togüí',
        code: '15816',
      },
      {
        value: 'topaga_boyaca',
        label: 'Tópaga',
        code: '15820',
      },
      {
        value: 'tota_boyaca',
        label: 'Tota',
        code: '15822',
      },
      {
        value: 'tunja_boyaca',
        label: 'Tunja',
        code: '15001',
      },
      {
        value: 'tunungua_boyaca',
        label: 'Tununguá',
        code: '15832',
      },
      {
        value: 'turmeque_boyaca',
        label: 'Turmequé',
        code: '15835',
      },
      {
        value: 'tuta_boyaca',
        label: 'Tuta',
        code: '15837',
      },
      {
        value: 'tutaza_boyaca',
        label: 'Tutazá',
        code: '15839',
      },
      {
        value: 'umbita_boyaca',
        label: 'Úmbita',
        code: '15842',
      },
      {
        value: 'ventaquemada_boyaca',
        label: 'Ventaquemada',
        code: '15861',
      },
      {
        value: 'villa_de_leyva_boyaca',
        label: 'Villa De Leyva',
        code: '15407',
      },
      {
        value: 'viracacha_boyaca',
        label: 'Viracachá',
        code: '15879',
      },
      {
        value: 'zetaquira_boyaca',
        label: 'Zetaquira',
        code: '15897',
      },
    ],
  },
  {
    value: 'caldas',
    label: 'Caldas',
    code: '17',
    cities: [
      {
        value: 'aguadas_caldas',
        label: 'Aguadas',
        code: '17013',
      },
      {
        value: 'anserma_caldas',
        label: 'Anserma',
        code: '17042',
      },
      {
        value: 'aranzazu_caldas',
        label: 'Aranzazu',
        code: '17050',
      },
      {
        value: 'belalcazar_caldas',
        label: 'Belalcázar',
        code: '17088',
      },
      {
        value: 'chinchina_caldas',
        label: 'Chinchiná',
        code: '17174',
      },
      {
        value: 'filadelfia_caldas',
        label: 'Filadelfia',
        code: '17272',
      },
      {
        value: 'la_dorada_caldas',
        label: 'La Dorada',
        code: '17380',
      },
      {
        value: 'la_merced_caldas',
        label: 'La Merced',
        code: '17388',
      },
      {
        value: 'manizales_caldas',
        label: 'Manizales',
        code: '17001',
      },
      {
        value: 'manzanares_caldas',
        label: 'Manzanares',
        code: '17433',
      },
      {
        value: 'marmato_caldas',
        label: 'Marmato',
        code: '17442',
      },
      {
        value: 'marquetalia_caldas',
        label: 'Marquetalia',
        code: '17444',
      },
      {
        value: 'marulanda_caldas',
        label: 'Marulanda',
        code: '17446',
      },
      {
        value: 'neira_caldas',
        label: 'Neira',
        code: '17486',
      },
      {
        value: 'norcasia_caldas',
        label: 'Norcasia',
        code: '17495',
      },
      {
        value: 'pacora_caldas',
        label: 'Pácora',
        code: '17513',
      },
      {
        value: 'palestina_caldas',
        label: 'Palestina',
        code: '17524',
      },
      {
        value: 'pensilvania_caldas',
        label: 'Pensilvania',
        code: '17541',
      },
      {
        value: 'riosucio_caldas',
        label: 'Riosucio',
        code: '17614',
      },
      {
        value: 'risaralda_caldas',
        label: 'Risaralda',
        code: '17616',
      },
      {
        value: 'salamina_caldas',
        label: 'Salamina',
        code: '17653',
      },
      {
        value: 'samana_caldas',
        label: 'Samaná',
        code: '17662',
      },
      {
        value: 'san_jose_caldas',
        label: 'San José',
        code: '17665',
      },
      {
        value: 'supia_caldas',
        label: 'Supía',
        code: '17777',
      },
      {
        value: 'victoria_caldas',
        label: 'Victoria',
        code: '17867',
      },
      {
        value: 'villamaria_caldas',
        label: 'Villamaría',
        code: '17873',
      },
      {
        value: 'viterbo_caldas',
        label: 'Viterbo',
        code: '17877',
      },
    ],
  },
  {
    value: 'caqueta',
    label: 'Caquetá',
    code: '18',
    cities: [
      {
        value: 'albania_caqueta',
        label: 'Albania',
        code: '18029',
      },
      {
        value: 'belen_de_los_andaquies_caqueta',
        label: 'Belén De Los Andaquíes',
        code: '18094',
      },
      {
        value: 'cartagena_del_chaira_caqueta',
        label: 'Cartagena Del Chairá',
        code: '18150',
      },
      {
        value: 'curillo_caqueta',
        label: 'Curillo',
        code: '18205',
      },
      {
        value: 'el_doncello_caqueta',
        label: 'El Doncello',
        code: '18247',
      },
      {
        value: 'el_paujil_caqueta',
        label: 'El Paujíl',
        code: '18256',
      },
      {
        value: 'florencia_caqueta',
        label: 'Florencia',
        code: '18001',
      },
      {
        value: 'la_montanita_caqueta',
        label: 'La Montañita',
        code: '18410',
      },
      {
        value: 'milan_caqueta',
        label: 'Milán',
        code: '18460',
      },
      {
        value: 'morelia_caqueta',
        label: 'Morelia',
        code: '18479',
      },
      {
        value: 'puerto_rico_caqueta',
        label: 'Puerto Rico',
        code: '18592',
      },
      {
        value: 'san_jose_del_fragua_caqueta',
        label: 'San José Del Fragua',
        code: '18610',
      },
      {
        value: 'san_vicente_del_caguan_caqueta',
        label: 'San Vicente Del Caguán',
        code: '18753',
      },
      {
        value: 'solano_caqueta',
        label: 'Solano',
        code: '18756',
      },
      {
        value: 'solita_caqueta',
        label: 'Solita',
        code: '18785',
      },
      {
        value: 'valparaiso_caqueta',
        label: 'Valparaíso',
        code: '18860',
      },
    ],
  },
  {
    value: 'casanare',
    label: 'Casanare',
    code: '85',
    cities: [
      {
        value: 'aguazul_casanare',
        label: 'Aguazul',
        code: '85010',
      },
      {
        value: 'chameza_casanare',
        label: 'Chámeza',
        code: '85015',
      },
      {
        value: 'hato_corozal_casanare',
        label: 'Hato Corozal',
        code: '85125',
      },
      {
        value: 'la_salina_casanare',
        label: 'La Salina',
        code: '85136',
      },
      {
        value: 'mani_casanare',
        label: 'Maní',
        code: '85139',
      },
      {
        value: 'monterrey_casanare',
        label: 'Monterrey',
        code: '85162',
      },
      {
        value: 'nunchia_casanare',
        label: 'Nunchía',
        code: '85225',
      },
      {
        value: 'orocue_casanare',
        label: 'Orocué',
        code: '85230',
      },
      {
        value: 'paz_de_ariporo_casanare',
        label: 'Paz De Ariporo',
        code: '85250',
      },
      {
        value: 'pore_casanare',
        label: 'Pore',
        code: '85263',
      },
      {
        value: 'recetor_casanare',
        label: 'Recetor',
        code: '85279',
      },
      {
        value: 'sabanalarga_casanare',
        label: 'Sabanalarga',
        code: '85300',
      },
      {
        value: 'sacama_casanare',
        label: 'Sácama',
        code: '85315',
      },
      {
        value: 'san_luis_de_palenque_casanare',
        label: 'San Luis De Palenque',
        code: '85325',
      },
      {
        value: 'tamara_casanare',
        label: 'Támara',
        code: '85400',
      },
      {
        value: 'tauramena_casanare',
        label: 'Tauramena',
        code: '85410',
      },
      {
        value: 'trinidad_casanare',
        label: 'Trinidad',
        code: '85430',
      },
      {
        value: 'villanueva_casanare',
        label: 'Villanueva',
        code: '85440',
      },
      {
        value: 'yopal_casanare',
        label: 'Yopal',
        code: '85001',
      },
    ],
  },
  {
    value: 'cauca',
    label: 'Cauca',
    code: '19',
    cities: [
      {
        value: 'almaguer_cauca',
        label: 'Almaguer',
        code: '19022',
      },
      {
        value: 'argelia_cauca',
        label: 'Argelia',
        code: '19050',
      },
      {
        value: 'balboa_cauca',
        label: 'Balboa',
        code: '19075',
      },
      {
        value: 'bolivar_cauca',
        label: 'Bolívar',
        code: '19100',
      },
      {
        value: 'buenos_aires_cauca',
        label: 'Buenos Aires',
        code: '19110',
      },
      {
        value: 'cajibio_cauca',
        label: 'Cajibío',
        code: '19130',
      },
      {
        value: 'caldono_cauca',
        label: 'Caldono',
        code: '19137',
      },
      {
        value: 'caloto_cauca',
        label: 'Caloto',
        code: '19142',
      },
      {
        value: 'corinto_cauca',
        label: 'Corinto',
        code: '19212',
      },
      {
        value: 'el_tambo_cauca',
        label: 'El Tambo',
        code: '19256',
      },
      {
        value: 'florencia_cauca',
        label: 'Florencia',
        code: '19290',
      },
      {
        value: 'guachene_cauca',
        label: 'Guachené',
        code: '19300',
      },
      {
        value: 'guapi_cauca',
        label: 'Guapi',
        code: '19318',
      },
      {
        value: 'inza_cauca',
        label: 'Inzá',
        code: '19355',
      },
      {
        value: 'jambalo_cauca',
        label: 'Jambaló',
        code: '19364',
      },
      {
        value: 'la_sierra_cauca',
        label: 'La Sierra',
        code: '19392',
      },
      {
        value: 'la_vega_cauca',
        label: 'La Vega',
        code: '19397',
      },
      {
        value: 'lopez_de_micay_cauca',
        label: 'López De Micay',
        code: '19418',
      },
      {
        value: 'mercaderes_cauca',
        label: 'Mercaderes',
        code: '19450',
      },
      {
        value: 'miranda_cauca',
        label: 'Miranda',
        code: '19455',
      },
      {
        value: 'morales_cauca',
        label: 'Morales',
        code: '19473',
      },
      {
        value: 'padilla_cauca',
        label: 'Padilla',
        code: '19513',
      },
      {
        value: 'paez_cauca',
        label: 'Páez',
        code: '19517',
      },
      {
        value: 'patia_cauca',
        label: 'Patía',
        code: '19532',
      },
      {
        value: 'piamonte_cauca',
        label: 'Piamonte',
        code: '19533',
      },
      {
        value: 'piendamo_tunia_cauca',
        label: 'Piendamó – Tunía',
        code: '19548',
      },
      {
        value: 'popayan_cauca',
        label: 'Popayán',
        code: '19001',
      },
      {
        value: 'puerto_tejada_cauca',
        label: 'Puerto Tejada',
        code: '19573',
      },
      {
        value: 'purace_cauca',
        label: 'Puracé',
        code: '19585',
      },
      {
        value: 'rosas_cauca',
        label: 'Rosas',
        code: '19622',
      },
      {
        value: 'san_sebastian_cauca',
        label: 'San Sebastián',
        code: '19693',
      },
      {
        value: 'santa_rosa_cauca',
        label: 'Santa Rosa',
        code: '19701',
      },
      {
        value: 'santander_de_quilichao_cauca',
        label: 'Santander De Quilichao',
        code: '19698',
      },
      {
        value: 'silvia_cauca',
        label: 'Silvia',
        code: '19743',
      },
      {
        value: 'sotara_paispamba_cauca',
        label: 'Sotará Paispamba',
        code: '19760',
      },
      {
        value: 'suarez_cauca',
        label: 'Suárez',
        code: '19780',
      },
      {
        value: 'sucre_cauca',
        label: 'Sucre',
        code: '19785',
      },
      {
        value: 'timbio_cauca',
        label: 'Timbío',
        code: '19807',
      },
      {
        value: 'timbiqui_cauca',
        label: 'Timbiquí',
        code: '19809',
      },
      {
        value: 'toribio_cauca',
        label: 'Toribío',
        code: '19821',
      },
      {
        value: 'totoro_cauca',
        label: 'Totoró',
        code: '19824',
      },
      {
        value: 'villa_rica_cauca',
        label: 'Villa Rica',
        code: '19845',
      },
    ],
  },
  {
    value: 'cesar',
    label: 'Cesar',
    code: '20',
    cities: [
      {
        value: 'aguachica_cesar',
        label: 'Aguachica',
        code: '20011',
      },
      {
        value: 'agustin_codazzi_cesar',
        label: 'Agustín Codazzi',
        code: '20013',
      },
      {
        value: 'astrea_cesar',
        label: 'Astrea',
        code: '20032',
      },
      {
        value: 'becerril_cesar',
        label: 'Becerril',
        code: '20045',
      },
      {
        value: 'bosconia_cesar',
        label: 'Bosconia',
        code: '20060',
      },
      {
        value: 'chimichagua_cesar',
        label: 'Chimichagua',
        code: '20175',
      },
      {
        value: 'chiriguana_cesar',
        label: 'Chiriguaná',
        code: '20178',
      },
      {
        value: 'curumani_cesar',
        label: 'Curumaní',
        code: '20228',
      },
      {
        value: 'el_copey_cesar',
        label: 'El Copey',
        code: '20238',
      },
      {
        value: 'el_paso_cesar',
        label: 'El Paso',
        code: '20250',
      },
      {
        value: 'gamarra_cesar',
        label: 'Gamarra',
        code: '20295',
      },
      {
        value: 'gonzalez_cesar',
        label: 'González',
        code: '20310',
      },
      {
        value: 'la_gloria_cesar',
        label: 'La Gloria',
        code: '20383',
      },
      {
        value: 'la_jagua_de_ibirico_cesar',
        label: 'La Jagua De Ibirico',
        code: '20400',
      },
      {
        value: 'la_paz_cesar',
        label: 'La Paz',
        code: '20621',
      },
      {
        value: 'manaure_balcon_del_cesar_cesar',
        label: 'Manaure Balcón Del Cesar',
        code: '20443',
      },
      {
        value: 'pailitas_cesar',
        label: 'Pailitas',
        code: '20517',
      },
      {
        value: 'pelaya_cesar',
        label: 'Pelaya',
        code: '20550',
      },
      {
        value: 'pueblo_bello_cesar',
        label: 'Pueblo Bello',
        code: '20570',
      },
      {
        value: 'rio_de_oro_cesar',
        label: 'Río De Oro',
        code: '20614',
      },
      {
        value: 'san_alberto_cesar',
        label: 'San Alberto',
        code: '20710',
      },
      {
        value: 'san_diego_cesar',
        label: 'San Diego',
        code: '20750',
      },
      {
        value: 'san_martin_cesar',
        label: 'San Martín',
        code: '20770',
      },
      {
        value: 'tamalameque_cesar',
        label: 'Tamalameque',
        code: '20787',
      },
      {
        value: 'valledupar_cesar',
        label: 'Valledupar',
        code: '20001',
      },
    ],
  },
  {
    value: 'choco',
    label: 'Chocó',
    code: '27',
    cities: [
      {
        value: 'acandi_choco',
        label: 'Acandí',
        code: '27006',
      },
      {
        value: 'alto_baudo_choco',
        label: 'Alto Baudó',
        code: '27025',
      },
      {
        value: 'atrato_choco',
        label: 'Atrato',
        code: '27050',
      },
      {
        value: 'bagado_choco',
        label: 'Bagadó',
        code: '27073',
      },
      {
        value: 'bahia_solano_choco',
        label: 'Bahía Solano',
        code: '27075',
      },
      {
        value: 'bajo_baudo_choco',
        label: 'Bajo Baudó',
        code: '27077',
      },
      {
        value: 'bojaya_choco',
        label: 'Bojayá',
        code: '27099',
      },
      {
        value: 'carmen_del_darien_choco',
        label: 'Carmen Del Darién',
        code: '27150',
      },
      {
        value: 'certegui_choco',
        label: 'Cértegui',
        code: '27160',
      },
      {
        value: 'condoto_choco',
        label: 'Condoto',
        code: '27205',
      },
      {
        value: 'el_canton_del_san_pablo_choco',
        label: 'El Cantón Del San Pablo',
        code: '27135',
      },
      {
        value: 'el_carmen_de_atrato_choco',
        label: 'El Carmen De Atrato',
        code: '27245',
      },
      {
        value: 'el_litoral_del_san_juan_choco',
        label: 'El Litoral Del San Juan',
        code: '27250',
      },
      {
        value: 'istmina_choco',
        label: 'Istmina',
        code: '27361',
      },
      {
        value: 'jurado_choco',
        label: 'Juradó',
        code: '27372',
      },
      {
        value: 'lloro_choco',
        label: 'Lloró',
        code: '27413',
      },
      {
        value: 'medio_atrato_choco',
        label: 'Medio Atrato',
        code: '27425',
      },
      {
        value: 'medio_baudo_choco',
        label: 'Medio Baudó',
        code: '27430',
      },
      {
        value: 'medio_san_juan_choco',
        label: 'Medio San Juan',
        code: '27450',
      },
      {
        value: 'novita_choco',
        label: 'Nóvita',
        code: '27491',
      },
      {
        value: 'nuqui_choco',
        label: 'Nuquí',
        code: '27495',
      },
      {
        value: 'quibdo_choco',
        label: 'Quibdó',
        code: '27001',
      },
      {
        value: 'rio_iro_choco',
        label: 'Río Iró',
        code: '27580',
      },
      {
        value: 'rio_quito_choco',
        label: 'Río Quito',
        code: '27600',
      },
      {
        value: 'riosucio_choco',
        label: 'Riosucio',
        code: '27615',
      },
      {
        value: 'san_jose_del_palmar_choco',
        label: 'San José Del Palmar',
        code: '27660',
      },
      {
        value: 'sipi_choco',
        label: 'Sipí',
        code: '27745',
      },
      {
        value: 'tado_choco',
        label: 'Tadó',
        code: '27787',
      },
      {
        value: 'unguia_choco',
        label: 'Unguía',
        code: '27800',
      },
      {
        value: 'union_panamericana_choco',
        label: 'Unión Panamericana',
        code: '27810',
      },
    ],
  },
  {
    value: 'cordoba',
    label: 'Córdoba',
    code: '23',
    cities: [
      {
        value: 'ayapel_cordoba',
        label: 'Ayapel',
        code: '23068',
      },
      {
        value: 'buenavista_cordoba',
        label: 'Buenavista',
        code: '23079',
      },
      {
        value: 'canalete_cordoba',
        label: 'Canalete',
        code: '23090',
      },
      {
        value: 'cerete_cordoba',
        label: 'Cereté',
        code: '23162',
      },
      {
        value: 'chima_cordoba',
        label: 'Chimá',
        code: '23168',
      },
      {
        value: 'chinu_cordoba',
        label: 'Chinú',
        code: '23182',
      },
      {
        value: 'cienaga_de_oro_cordoba',
        label: 'Ciénaga De Oro',
        code: '23189',
      },
      {
        value: 'cotorra_cordoba',
        label: 'Cotorra',
        code: '23300',
      },
      {
        value: 'la_apartada_cordoba',
        label: 'La Apartada',
        code: '23350',
      },
      {
        value: 'lorica_cordoba',
        label: 'Lorica',
        code: '23417',
      },
      {
        value: 'los_cordobas_cordoba',
        label: 'Los Córdobas',
        code: '23419',
      },
      {
        value: 'momil_cordoba',
        label: 'Momil',
        code: '23464',
      },
      {
        value: 'montelibano_cordoba',
        label: 'Montelíbano',
        code: '23466',
      },
      {
        value: 'monteria_cordoba',
        label: 'Montería',
        code: '23001',
      },
      {
        value: 'monitos_cordoba',
        label: 'Moñitos',
        code: '23500',
      },
      {
        value: 'planeta_rica_cordoba',
        label: 'Planeta Rica',
        code: '23555',
      },
      {
        value: 'pueblo_nuevo_cordoba',
        label: 'Pueblo Nuevo',
        code: '23570',
      },
      {
        value: 'puerto_escondido_cordoba',
        label: 'Puerto Escondido',
        code: '23574',
      },
      {
        value: 'puerto_libertador_cordoba',
        label: 'Puerto Libertador',
        code: '23580',
      },
      {
        value: 'purisima_de_la_concepcion_cordoba',
        label: 'Purísima De La Concepción',
        code: '23586',
      },
      {
        value: 'sahagun_cordoba',
        label: 'Sahagún',
        code: '23660',
      },
      {
        value: 'san_andres_de_sotavento_cordoba',
        label: 'San Andrés De Sotavento',
        code: '23670',
      },
      {
        value: 'san_antero_cordoba',
        label: 'San Antero',
        code: '23672',
      },
      {
        value: 'san_bernardo_del_viento_cordoba',
        label: 'San Bernardo Del Viento',
        code: '23675',
      },
      {
        value: 'san_carlos_cordoba',
        label: 'San Carlos',
        code: '23678',
      },
      {
        value: 'san_jose_de_ure_cordoba',
        label: 'San José De Uré',
        code: '23682',
      },
      {
        value: 'san_pelayo_cordoba',
        label: 'San Pelayo',
        code: '23686',
      },
      {
        value: 'tierralta_cordoba',
        label: 'Tierralta',
        code: '23807',
      },
      {
        value: 'tuchin_cordoba',
        label: 'Tuchín',
        code: '23815',
      },
      {
        value: 'valencia_cordoba',
        label: 'Valencia',
        code: '23855',
      },
    ],
  },
  {
    value: 'cundinamarca',
    label: 'Cundinamarca',
    code: '25',
    cities: [
      {
        value: 'agua_de_dios_cundinamarca',
        label: 'Agua De Dios',
        code: '25001',
      },
      {
        value: 'alban_cundinamarca',
        label: 'Albán',
        code: '25019',
      },
      {
        value: 'anapoima_cundinamarca',
        label: 'Anapoima',
        code: '25035',
      },
      {
        value: 'anolaima_cundinamarca',
        label: 'Anolaima',
        code: '25040',
      },
      {
        value: 'apulo_cundinamarca',
        label: 'Apulo',
        code: '25599',
      },
      {
        value: 'arbelaez_cundinamarca',
        label: 'Arbeláez',
        code: '25053',
      },
      {
        value: 'beltran_cundinamarca',
        label: 'Beltrán',
        code: '25086',
      },
      {
        value: 'bituima_cundinamarca',
        label: 'Bituima',
        code: '25095',
      },
      {
        value: 'bojaca_cundinamarca',
        label: 'Bojacá',
        code: '25099',
      },
      {
        value: 'cabrera_cundinamarca',
        label: 'Cabrera',
        code: '25120',
      },
      {
        value: 'cachipay_cundinamarca',
        label: 'Cachipay',
        code: '25123',
      },
      {
        value: 'cajica_cundinamarca',
        label: 'Cajicá',
        code: '25126',
      },
      {
        value: 'caparrapi_cundinamarca',
        label: 'Caparrapí',
        code: '25148',
      },
      {
        value: 'caqueza_cundinamarca',
        label: 'Cáqueza',
        code: '25151',
      },
      {
        value: 'carmen_de_carupa_cundinamarca',
        label: 'Carmen De Carupa',
        code: '25154',
      },
      {
        value: 'chaguani_cundinamarca',
        label: 'Chaguaní',
        code: '25168',
      },
      {
        value: 'chia_cundinamarca',
        label: 'Chía',
        code: '25175',
      },
      {
        value: 'chipaque_cundinamarca',
        label: 'Chipaque',
        code: '25178',
      },
      {
        value: 'choachi_cundinamarca',
        label: 'Choachí',
        code: '25181',
      },
      {
        value: 'choconta_cundinamarca',
        label: 'Chocontá',
        code: '25183',
      },
      {
        value: 'cogua_cundinamarca',
        label: 'Cogua',
        code: '25200',
      },
      {
        value: 'cota_cundinamarca',
        label: 'Cota',
        code: '25214',
      },
      {
        value: 'cucunuba_cundinamarca',
        label: 'Cucunubá',
        code: '25224',
      },
      {
        value: 'el_colegio_cundinamarca',
        label: 'El Colegio',
        code: '25245',
      },
      {
        value: 'el_penon_cundinamarca',
        label: 'El Peñón',
        code: '25258',
      },
      {
        value: 'el_rosal_cundinamarca',
        label: 'El Rosal',
        code: '25260',
      },
      {
        value: 'facatativa_cundinamarca',
        label: 'Facatativá',
        code: '25269',
      },
      {
        value: 'fomeque_cundinamarca',
        label: 'Fómeque',
        code: '25279',
      },
      {
        value: 'fosca_cundinamarca',
        label: 'Fosca',
        code: '25281',
      },
      {
        value: 'funza_cundinamarca',
        label: 'Funza',
        code: '25286',
      },
      {
        value: 'fuquene_cundinamarca',
        label: 'Fúquene',
        code: '25288',
      },
      {
        value: 'fusagasuga_cundinamarca',
        label: 'Fusagasugá',
        code: '25290',
      },
      {
        value: 'gachala_cundinamarca',
        label: 'Gachalá',
        code: '25293',
      },
      {
        value: 'gachancipa_cundinamarca',
        label: 'Gachancipá',
        code: '25295',
      },
      {
        value: 'gacheta_cundinamarca',
        label: 'Gachetá',
        code: '25297',
      },
      {
        value: 'gama_cundinamarca',
        label: 'Gama',
        code: '25299',
      },
      {
        value: 'girardot_cundinamarca',
        label: 'Girardot',
        code: '25307',
      },
      {
        value: 'granada_cundinamarca',
        label: 'Granada',
        code: '25312',
      },
      {
        value: 'guacheta_cundinamarca',
        label: 'Guachetá',
        code: '25317',
      },
      {
        value: 'guaduas_cundinamarca',
        label: 'Guaduas',
        code: '25320',
      },
      {
        value: 'guasca_cundinamarca',
        label: 'Guasca',
        code: '25322',
      },
      {
        value: 'guataqui_cundinamarca',
        label: 'Guataquí',
        code: '25324',
      },
      {
        value: 'guatavita_cundinamarca',
        label: 'Guatavita',
        code: '25326',
      },
      {
        value: 'guayabal_de_siquima_cundinamarca',
        label: 'Guayabal De Síquima',
        code: '25328',
      },
      {
        value: 'guayabetal_cundinamarca',
        label: 'Guayabetal',
        code: '25335',
      },
      {
        value: 'gutierrez_cundinamarca',
        label: 'Gutiérrez',
        code: '25339',
      },
      {
        value: 'jerusalen_cundinamarca',
        label: 'Jerusalén',
        code: '25368',
      },
      {
        value: 'junin_cundinamarca',
        label: 'Junín',
        code: '25372',
      },
      {
        value: 'la_calera_cundinamarca',
        label: 'La Calera',
        code: '25377',
      },
      {
        value: 'la_mesa_cundinamarca',
        label: 'La Mesa',
        code: '25386',
      },
      {
        value: 'la_palma_cundinamarca',
        label: 'La Palma',
        code: '25394',
      },
      {
        value: 'la_pena_cundinamarca',
        label: 'La Peña',
        code: '25398',
      },
      {
        value: 'la_vega_cundinamarca',
        label: 'La Vega',
        code: '25402',
      },
      {
        value: 'lenguazaque_cundinamarca',
        label: 'Lenguazaque',
        code: '25407',
      },
      {
        value: 'macheta_cundinamarca',
        label: 'Machetá',
        code: '25426',
      },
      {
        value: 'madrid_cundinamarca',
        label: 'Madrid',
        code: '25430',
      },
      {
        value: 'manta_cundinamarca',
        label: 'Manta',
        code: '25436',
      },
      {
        value: 'medina_cundinamarca',
        label: 'Medina',
        code: '25438',
      },
      {
        value: 'mosquera_cundinamarca',
        label: 'Mosquera',
        code: '25473',
      },
      {
        value: 'narino_cundinamarca',
        label: 'Nariño',
        code: '25483',
      },
      {
        value: 'nemocon_cundinamarca',
        label: 'Nemocón',
        code: '25486',
      },
      {
        value: 'nilo_cundinamarca',
        label: 'Nilo',
        code: '25488',
      },
      {
        value: 'nimaima_cundinamarca',
        label: 'Nimaima',
        code: '25489',
      },
      {
        value: 'nocaima_cundinamarca',
        label: 'Nocaima',
        code: '25491',
      },
      {
        value: 'pacho_cundinamarca',
        label: 'Pacho',
        code: '25513',
      },
      {
        value: 'paime_cundinamarca',
        label: 'Paime',
        code: '25518',
      },
      {
        value: 'pandi_cundinamarca',
        label: 'Pandi',
        code: '25524',
      },
      {
        value: 'paratebueno_cundinamarca',
        label: 'Paratebueno',
        code: '25530',
      },
      {
        value: 'pasca_cundinamarca',
        label: 'Pasca',
        code: '25535',
      },
      {
        value: 'puerto_salgar_cundinamarca',
        label: 'Puerto Salgar',
        code: '25572',
      },
      {
        value: 'puli_cundinamarca',
        label: 'Pulí',
        code: '25580',
      },
      {
        value: 'quebradanegra_cundinamarca',
        label: 'Quebradanegra',
        code: '25592',
      },
      {
        value: 'quetame_cundinamarca',
        label: 'Quetame',
        code: '25594',
      },
      {
        value: 'quipile_cundinamarca',
        label: 'Quipile',
        code: '25596',
      },
      {
        value: 'ricaurte_cundinamarca',
        label: 'Ricaurte',
        code: '25612',
      },
      {
        value: 'san_antonio_del_tequendama_cundinamarca',
        label: 'San Antonio Del Tequendama',
        code: '25645',
      },
      {
        value: 'san_bernardo_cundinamarca',
        label: 'San Bernardo',
        code: '25649',
      },
      {
        value: 'san_cayetano_cundinamarca',
        label: 'San Cayetano',
        code: '25653',
      },
      {
        value: 'san_francisco_cundinamarca',
        label: 'San Francisco',
        code: '25658',
      },
      {
        value: 'san_juan_de_rioseco_cundinamarca',
        label: 'San Juan De Rioseco',
        code: '25662',
      },
      {
        value: 'sasaima_cundinamarca',
        label: 'Sasaima',
        code: '25718',
      },
      {
        value: 'sesquile_cundinamarca',
        label: 'Sesquilé',
        code: '25736',
      },
      {
        value: 'sibate_cundinamarca',
        label: 'Sibaté',
        code: '25740',
      },
      {
        value: 'silvania_cundinamarca',
        label: 'Silvania',
        code: '25743',
      },
      {
        value: 'simijaca_cundinamarca',
        label: 'Simijaca',
        code: '25745',
      },
      {
        value: 'soacha_cundinamarca',
        label: 'Soacha',
        code: '25754',
      },
      {
        value: 'sopo_cundinamarca',
        label: 'Sopó',
        code: '25758',
      },
      {
        value: 'subachoque_cundinamarca',
        label: 'Subachoque',
        code: '25769',
      },
      {
        value: 'suesca_cundinamarca',
        label: 'Suesca',
        code: '25772',
      },
      {
        value: 'supata_cundinamarca',
        label: 'Supatá',
        code: '25777',
      },
      {
        value: 'susa_cundinamarca',
        label: 'Susa',
        code: '25779',
      },
      {
        value: 'sutatausa_cundinamarca',
        label: 'Sutatausa',
        code: '25781',
      },
      {
        value: 'tabio_cundinamarca',
        label: 'Tabio',
        code: '25785',
      },
      {
        value: 'tausa_cundinamarca',
        label: 'Tausa',
        code: '25793',
      },
      {
        value: 'tena_cundinamarca',
        label: 'Tena',
        code: '25797',
      },
      {
        value: 'tenjo_cundinamarca',
        label: 'Tenjo',
        code: '25799',
      },
      {
        value: 'tibacuy_cundinamarca',
        label: 'Tibacuy',
        code: '25805',
      },
      {
        value: 'tibirita_cundinamarca',
        label: 'Tibirita',
        code: '25807',
      },
      {
        value: 'tocaima_cundinamarca',
        label: 'Tocaima',
        code: '25815',
      },
      {
        value: 'tocancipa_cundinamarca',
        label: 'Tocancipá',
        code: '25817',
      },
      {
        value: 'topaipi_cundinamarca',
        label: 'Topaipí',
        code: '25823',
      },
      {
        value: 'ubala_cundinamarca',
        label: 'Ubalá',
        code: '25839',
      },
      {
        value: 'ubaque_cundinamarca',
        label: 'Ubaque',
        code: '25841',
      },
      {
        value: 'une_cundinamarca',
        label: 'Une',
        code: '25845',
      },
      {
        value: 'utica_cundinamarca',
        label: 'Útica',
        code: '25851',
      },
      {
        value: 'venecia_cundinamarca',
        label: 'Venecia',
        code: '25506',
      },
      {
        value: 'vergara_cundinamarca',
        label: 'Vergara',
        code: '25862',
      },
      {
        value: 'viani_cundinamarca',
        label: 'Vianí',
        code: '25867',
      },
      {
        value: 'villa_de_san_diego_de_ubate_cundinamarca',
        label: 'Villa De San Diego De Ubaté',
        code: '25843',
      },
      {
        value: 'villagomez_cundinamarca',
        label: 'Villagómez',
        code: '25871',
      },
      {
        value: 'villapinzon_cundinamarca',
        label: 'Villapinzón',
        code: '25873',
      },
      {
        value: 'villeta_cundinamarca',
        label: 'Villeta',
        code: '25875',
      },
      {
        value: 'viota_cundinamarca',
        label: 'Viotá',
        code: '25878',
      },
      {
        value: 'yacopi_cundinamarca',
        label: 'Yacopí',
        code: '25885',
      },
      {
        value: 'zipacon_cundinamarca',
        label: 'Zipacón',
        code: '25898',
      },
      {
        value: 'zipaquira_cundinamarca',
        label: 'Zipaquirá',
        code: '25899',
      },
    ],
  },
  {
    value: 'guainia',
    label: 'Guainía',
    code: '94',
    cities: [
      {
        value: 'barrancominas_guainia',
        label: 'Barrancominas',
        code: '94343',
      },
      {
        value: 'cacahual_guainia',
        label: 'Cacahual',
        code: '94886',
      },
      {
        value: 'inirida_guainia',
        label: 'Inírida',
        code: '94001',
      },
      {
        value: 'la_guadalupe_guainia',
        label: 'La Guadalupe',
        code: '94885',
      },
      {
        value: 'morichal_guainia',
        label: 'Morichal',
        code: '94888',
      },
      {
        value: 'pana_pana_guainia',
        label: 'Pana Pana',
        code: '94887',
      },
      {
        value: 'puerto_colombia_guainia',
        label: 'Puerto Colombia',
        code: '94884',
      },
      {
        value: 'san_felipe_guainia',
        label: 'San Felipe',
        code: '94883',
      },
    ],
  },
  {
    value: 'guaviare',
    label: 'Guaviare',
    code: '95',
    cities: [
      {
        value: 'calamar_guaviare',
        label: 'Calamar',
        code: '95015',
      },
      {
        value: 'el_retorno_guaviare',
        label: 'El Retorno',
        code: '95025',
      },
      {
        value: 'miraflores_guaviare',
        label: 'Miraflores',
        code: '95200',
      },
      {
        value: 'san_jose_del_guaviare_guaviare',
        label: 'San José Del Guaviare',
        code: '95001',
      },
    ],
  },
  {
    value: 'huila',
    label: 'Huila',
    code: '41',
    cities: [
      {
        value: 'acevedo_huila',
        label: 'Acevedo',
        code: '41006',
      },
      {
        value: 'agrado_huila',
        label: 'Agrado',
        code: '41013',
      },
      {
        value: 'aipe_huila',
        label: 'Aipe',
        code: '41016',
      },
      {
        value: 'algeciras_huila',
        label: 'Algeciras',
        code: '41020',
      },
      {
        value: 'altamira_huila',
        label: 'Altamira',
        code: '41026',
      },
      {
        value: 'baraya_huila',
        label: 'Baraya',
        code: '41078',
      },
      {
        value: 'campoalegre_huila',
        label: 'Campoalegre',
        code: '41132',
      },
      {
        value: 'colombia_huila',
        label: 'Colombia',
        code: '41206',
      },
      {
        value: 'elias_huila',
        label: 'Elías',
        code: '41244',
      },
      {
        value: 'garzon_huila',
        label: 'Garzón',
        code: '41298',
      },
      {
        value: 'gigante_huila',
        label: 'Gigante',
        code: '41306',
      },
      {
        value: 'guadalupe_huila',
        label: 'Guadalupe',
        code: '41319',
      },
      {
        value: 'hobo_huila',
        label: 'Hobo',
        code: '41349',
      },
      {
        value: 'iquira_huila',
        label: 'Íquira',
        code: '41357',
      },
      {
        value: 'isnos_huila',
        label: 'Isnos',
        code: '41359',
      },
      {
        value: 'la_argentina_huila',
        label: 'La Argentina',
        code: '41378',
      },
      {
        value: 'la_plata_huila',
        label: 'La Plata',
        code: '41396',
      },
      {
        value: 'nataga_huila',
        label: 'Nátaga',
        code: '41483',
      },
      {
        value: 'neiva_huila',
        label: 'Neiva',
        code: '41001',
      },
      {
        value: 'oporapa_huila',
        label: 'Oporapa',
        code: '41503',
      },
      {
        value: 'paicol_huila',
        label: 'Paicol',
        code: '41518',
      },
      {
        value: 'palermo_huila',
        label: 'Palermo',
        code: '41524',
      },
      {
        value: 'palestina_huila',
        label: 'Palestina',
        code: '41530',
      },
      {
        value: 'pital_huila',
        label: 'Pital',
        code: '41548',
      },
      {
        value: 'pitalito_huila',
        label: 'Pitalito',
        code: '41551',
      },
      {
        value: 'rivera_huila',
        label: 'Rivera',
        code: '41615',
      },
      {
        value: 'saladoblanco_huila',
        label: 'Saladoblanco',
        code: '41660',
      },
      {
        value: 'san_agustin_huila',
        label: 'San Agustín',
        code: '41668',
      },
      {
        value: 'santa_maria_huila',
        label: 'Santa María',
        code: '41676',
      },
      {
        value: 'suaza_huila',
        label: 'Suaza',
        code: '41770',
      },
      {
        value: 'tarqui_huila',
        label: 'Tarqui',
        code: '41791',
      },
      {
        value: 'tello_huila',
        label: 'Tello',
        code: '41799',
      },
      {
        value: 'teruel_huila',
        label: 'Teruel',
        code: '41801',
      },
      {
        value: 'tesalia_huila',
        label: 'Tesalia',
        code: '41797',
      },
      {
        value: 'timana_huila',
        label: 'Timaná',
        code: '41807',
      },
      {
        value: 'villavieja_huila',
        label: 'Villavieja',
        code: '41872',
      },
      {
        value: 'yaguara_huila',
        label: 'Yaguará',
        code: '41885',
      },
    ],
  },
  {
    value: 'la_guajira',
    label: 'La Guajira',
    code: '44',
    cities: [
      {
        value: 'albania_la_guajira',
        label: 'Albania',
        code: '44035',
      },
      {
        value: 'barrancas_la_guajira',
        label: 'Barrancas',
        code: '44078',
      },
      {
        value: 'dibulla_la_guajira',
        label: 'Dibulla',
        code: '44090',
      },
      {
        value: 'distraccion_la_guajira',
        label: 'Distracción',
        code: '44098',
      },
      {
        value: 'el_molino_la_guajira',
        label: 'El Molino',
        code: '44110',
      },
      {
        value: 'fonseca_la_guajira',
        label: 'Fonseca',
        code: '44279',
      },
      {
        value: 'hatonuevo_la_guajira',
        label: 'Hatonuevo',
        code: '44378',
      },
      {
        value: 'la_jagua_del_pilar_la_guajira',
        label: 'La Jagua Del Pilar',
        code: '44420',
      },
      {
        value: 'maicao_la_guajira',
        label: 'Maicao',
        code: '44430',
      },
      {
        value: 'manaure_la_guajira',
        label: 'Manaure',
        code: '44560',
      },
      {
        value: 'riohacha_la_guajira',
        label: 'Riohacha',
        code: '44001',
      },
      {
        value: 'san_juan_del_cesar_la_guajira',
        label: 'San Juan Del Cesar',
        code: '44650',
      },
      {
        value: 'uribia_la_guajira',
        label: 'Uribia',
        code: '44847',
      },
      {
        value: 'urumita_la_guajira',
        label: 'Urumita',
        code: '44855',
      },
      {
        value: 'villanueva_la_guajira',
        label: 'Villanueva',
        code: '44874',
      },
    ],
  },
  {
    value: 'magdalena',
    label: 'Magdalena',
    code: '47',
    cities: [
      {
        value: 'algarrobo_magdalena',
        label: 'Algarrobo',
        code: '47030',
      },
      {
        value: 'aracataca_magdalena',
        label: 'Aracataca',
        code: '47053',
      },
      {
        value: 'ariguani_magdalena',
        label: 'Ariguaní',
        code: '47058',
      },
      {
        value: 'cerro_de_san_antonio_magdalena',
        label: 'Cerro De San Antonio',
        code: '47161',
      },
      {
        value: 'chivolo_magdalena',
        label: 'Chivolo',
        code: '47170',
      },
      {
        value: 'cienaga_magdalena',
        label: 'Ciénaga',
        code: '47189',
      },
      {
        value: 'concordia_magdalena',
        label: 'Concordia',
        code: '47205',
      },
      {
        value: 'el_banco_magdalena',
        label: 'El Banco',
        code: '47245',
      },
      {
        value: 'el_pinon_magdalena',
        label: 'El Piñón',
        code: '47258',
      },
      {
        value: 'el_reten_magdalena',
        label: 'El Retén',
        code: '47268',
      },
      {
        value: 'fundacion_magdalena',
        label: 'Fundación',
        code: '47288',
      },
      {
        value: 'guamal_magdalena',
        label: 'Guamal',
        code: '47318',
      },
      {
        value: 'nueva_granada_magdalena',
        label: 'Nueva Granada',
        code: '47460',
      },
      {
        value: 'pedraza_magdalena',
        label: 'Pedraza',
        code: '47541',
      },
      {
        value: 'pijino_del_carmen_magdalena',
        label: 'Pijiño Del Carmen',
        code: '47545',
      },
      {
        value: 'pivijay_magdalena',
        label: 'Pivijay',
        code: '47551',
      },
      {
        value: 'plato_magdalena',
        label: 'Plato',
        code: '47555',
      },
      {
        value: 'puebloviejo_magdalena',
        label: 'Puebloviejo',
        code: '47570',
      },
      {
        value: 'remolino_magdalena',
        label: 'Remolino',
        code: '47605',
      },
      {
        value: 'sabanas_de_san_angel_magdalena',
        label: 'Sabanas De San Ángel',
        code: '47660',
      },
      {
        value: 'salamina_magdalena',
        label: 'Salamina',
        code: '47675',
      },
      {
        value: 'san_sebastian_de_buenavista_magdalena',
        label: 'San Sebastián De Buenavista',
        code: '47692',
      },
      {
        value: 'san_zenon_magdalena',
        label: 'San Zenón',
        code: '47703',
      },
      {
        value: 'santa_ana_magdalena',
        label: 'Santa Ana',
        code: '47707',
      },
      {
        value: 'santa_barbara_de_pinto_magdalena',
        label: 'Santa Bárbara De Pinto',
        code: '47720',
      },
      {
        value: 'santa_marta_magdalena',
        label: 'Santa Marta',
        code: '47001',
      },
      {
        value: 'sitionuevo_magdalena',
        label: 'Sitionuevo',
        code: '47745',
      },
      {
        value: 'tenerife_magdalena',
        label: 'Tenerife',
        code: '47798',
      },
      {
        value: 'zapayan_magdalena',
        label: 'Zapayán',
        code: '47960',
      },
      {
        value: 'zona_bananera_magdalena',
        label: 'Zona Bananera',
        code: '47980',
      },
    ],
  },
  {
    value: 'meta',
    label: 'Meta',
    code: '50',
    cities: [
      {
        value: 'acacias_meta',
        label: 'Acacías',
        code: '50006',
      },
      {
        value: 'barranca_de_upia_meta',
        label: 'Barranca De Upía',
        code: '50110',
      },
      {
        value: 'cabuyaro_meta',
        label: 'Cabuyaro',
        code: '50124',
      },
      {
        value: 'castilla_la_nueva_meta',
        label: 'Castilla La Nueva',
        code: '50150',
      },
      {
        value: 'cubarral_meta',
        label: 'Cubarral',
        code: '50223',
      },
      {
        value: 'cumaral_meta',
        label: 'Cumaral',
        code: '50226',
      },
      {
        value: 'el_calvario_meta',
        label: 'El Calvario',
        code: '50245',
      },
      {
        value: 'el_castillo_meta',
        label: 'El Castillo',
        code: '50251',
      },
      {
        value: 'el_dorado_meta',
        label: 'El Dorado',
        code: '50270',
      },
      {
        value: 'fuente_de_oro_meta',
        label: 'Fuente De Oro',
        code: '50287',
      },
      {
        value: 'granada_meta',
        label: 'Granada',
        code: '50313',
      },
      {
        value: 'guamal_meta',
        label: 'Guamal',
        code: '50318',
      },
      {
        value: 'la_macarena_meta',
        label: 'La Macarena',
        code: '50350',
      },
      {
        value: 'lejanias_meta',
        label: 'Lejanías',
        code: '50400',
      },
      {
        value: 'mapiripan_meta',
        label: 'Mapiripán',
        code: '50325',
      },
      {
        value: 'mesetas_meta',
        label: 'Mesetas',
        code: '50330',
      },
      {
        value: 'puerto_concordia_meta',
        label: 'Puerto Concordia',
        code: '50450',
      },
      {
        value: 'puerto_gaitan_meta',
        label: 'Puerto Gaitán',
        code: '50568',
      },
      {
        value: 'puerto_lleras_meta',
        label: 'Puerto Lleras',
        code: '50577',
      },
      {
        value: 'puerto_lopez_meta',
        label: 'Puerto López',
        code: '50573',
      },
      {
        value: 'puerto_rico_meta',
        label: 'Puerto Rico',
        code: '50590',
      },
      {
        value: 'restrepo_meta',
        label: 'Restrepo',
        code: '50606',
      },
      {
        value: 'san_carlos_de_guaroa_meta',
        label: 'San Carlos De Guaroa',
        code: '50680',
      },
      {
        value: 'san_juan_de_arama_meta',
        label: 'San Juan De Arama',
        code: '50683',
      },
      {
        value: 'san_juanito_meta',
        label: 'San Juanito',
        code: '50686',
      },
      {
        value: 'san_martin_meta',
        label: 'San Martín',
        code: '50689',
      },
      {
        value: 'uribe_meta',
        label: 'Uribe',
        code: '50370',
      },
      {
        value: 'villavicencio_meta',
        label: 'Villavicencio',
        code: '50001',
      },
      {
        value: 'vistahermosa_meta',
        label: 'Vistahermosa',
        code: '50711',
      },
    ],
  },
  {
    value: 'narino',
    label: 'Nariño',
    code: '52',
    cities: [
      {
        value: 'alban_narino',
        label: 'Albán',
        code: '52019',
      },
      {
        value: 'aldana_narino',
        label: 'Aldana',
        code: '52022',
      },
      {
        value: 'ancuya_narino',
        label: 'Ancuya',
        code: '52036',
      },
      {
        value: 'arboleda_narino',
        label: 'Arboleda',
        code: '52051',
      },
      {
        value: 'barbacoas_narino',
        label: 'Barbacoas',
        code: '52079',
      },
      {
        value: 'belen_narino',
        label: 'Belén',
        code: '52083',
      },
      {
        value: 'buesaco_narino',
        label: 'Buesaco',
        code: '52110',
      },
      {
        value: 'chachagui_narino',
        label: 'Chachagüí',
        code: '52240',
      },
      {
        value: 'colon_narino',
        label: 'Colón',
        code: '52203',
      },
      {
        value: 'consaca_narino',
        label: 'Consacá',
        code: '52207',
      },
      {
        value: 'contadero_narino',
        label: 'Contadero',
        code: '52210',
      },
      {
        value: 'cordoba_narino',
        label: 'Córdoba',
        code: '52215',
      },
      {
        value: 'cuaspud_carlosama_narino',
        label: 'Cuaspud Carlosama',
        code: '52224',
      },
      {
        value: 'cumbal_narino',
        label: 'Cumbal',
        code: '52227',
      },
      {
        value: 'cumbitara_narino',
        label: 'Cumbitara',
        code: '52233',
      },
      {
        value: 'el_charco_narino',
        label: 'El Charco',
        code: '52250',
      },
      {
        value: 'el_penol_narino',
        label: 'El Peñol',
        code: '52254',
      },
      {
        value: 'el_rosario_narino',
        label: 'El Rosario',
        code: '52256',
      },
      {
        value: 'el_tablon_de_gomez_narino',
        label: 'El Tablón De Gómez',
        code: '52258',
      },
      {
        value: 'el_tambo_narino',
        label: 'El Tambo',
        code: '52260',
      },
      {
        value: 'francisco_pizarro_narino',
        label: 'Francisco Pizarro',
        code: '52520',
      },
      {
        value: 'funes_narino',
        label: 'Funes',
        code: '52287',
      },
      {
        value: 'guachucal_narino',
        label: 'Guachucal',
        code: '52317',
      },
      {
        value: 'guaitarilla_narino',
        label: 'Guaitarilla',
        code: '52320',
      },
      {
        value: 'gualmatan_narino',
        label: 'Gualmatán',
        code: '52323',
      },
      {
        value: 'iles_narino',
        label: 'Iles',
        code: '52352',
      },
      {
        value: 'imues_narino',
        label: 'Imués',
        code: '52354',
      },
      {
        value: 'ipiales_narino',
        label: 'Ipiales',
        code: '52356',
      },
      {
        value: 'la_cruz_narino',
        label: 'La Cruz',
        code: '52378',
      },
      {
        value: 'la_florida_narino',
        label: 'La Florida',
        code: '52381',
      },
      {
        value: 'la_llanada_narino',
        label: 'La Llanada',
        code: '52385',
      },
      {
        value: 'la_tola_narino',
        label: 'La Tola',
        code: '52390',
      },
      {
        value: 'la_union_narino',
        label: 'La Unión',
        code: '52399',
      },
      {
        value: 'leiva_narino',
        label: 'Leiva',
        code: '52405',
      },
      {
        value: 'linares_narino',
        label: 'Linares',
        code: '52411',
      },
      {
        value: 'los_andes_narino',
        label: 'Los Andes',
        code: '52418',
      },
      {
        value: 'magui_narino',
        label: 'Magüí',
        code: '52427',
      },
      {
        value: 'mallama_narino',
        label: 'Mallama',
        code: '52435',
      },
      {
        value: 'mosquera_narino',
        label: 'Mosquera',
        code: '52473',
      },
      {
        value: 'narino_narino',
        label: 'Nariño',
        code: '52480',
      },
      {
        value: 'olaya_herrera_narino',
        label: 'Olaya Herrera',
        code: '52490',
      },
      {
        value: 'ospina_narino',
        label: 'Ospina',
        code: '52506',
      },
      {
        value: 'pasto_narino',
        label: 'Pasto',
        code: '52001',
      },
      {
        value: 'policarpa_narino',
        label: 'Policarpa',
        code: '52540',
      },
      {
        value: 'potosi_narino',
        label: 'Potosí',
        code: '52560',
      },
      {
        value: 'providencia_narino',
        label: 'Providencia',
        code: '52565',
      },
      {
        value: 'puerres_narino',
        label: 'Puerres',
        code: '52573',
      },
      {
        value: 'pupiales_narino',
        label: 'Pupiales',
        code: '52585',
      },
      {
        value: 'ricaurte_narino',
        label: 'Ricaurte',
        code: '52612',
      },
      {
        value: 'roberto_payan_narino',
        label: 'Roberto Payán',
        code: '52621',
      },
      {
        value: 'samaniego_narino',
        label: 'Samaniego',
        code: '52678',
      },
      {
        value: 'san_andres_de_tumaco_narino',
        label: 'San Andrés De Tumaco',
        code: '52835',
      },
      {
        value: 'san_bernardo_narino',
        label: 'San Bernardo',
        code: '52685',
      },
      {
        value: 'san_lorenzo_narino',
        label: 'San Lorenzo',
        code: '52687',
      },
      {
        value: 'san_pablo_narino',
        label: 'San Pablo',
        code: '52693',
      },
      {
        value: 'san_pedro_de_cartago_narino',
        label: 'San Pedro De Cartago',
        code: '52694',
      },
      {
        value: 'sandona_narino',
        label: 'Sandoná',
        code: '52683',
      },
      {
        value: 'santa_barbara_narino',
        label: 'Santa Bárbara',
        code: '52696',
      },
      {
        value: 'santacruz_narino',
        label: 'Santacruz',
        code: '52699',
      },
      {
        value: 'sapuyes_narino',
        label: 'Sapuyes',
        code: '52720',
      },
      {
        value: 'taminango_narino',
        label: 'Taminango',
        code: '52786',
      },
      {
        value: 'tangua_narino',
        label: 'Tangua',
        code: '52788',
      },
      {
        value: 'tuquerres_narino',
        label: 'Túquerres',
        code: '52838',
      },
      {
        value: 'yacuanquer_narino',
        label: 'Yacuanquer',
        code: '52885',
      },
    ],
  },
  {
    value: 'norte_de_santander',
    label: 'Norte De Santander',
    code: '54',
    cities: [
      {
        value: 'abrego_norte_de_santander',
        label: 'Ábrego',
        code: '54003',
      },
      {
        value: 'arboledas_norte_de_santander',
        label: 'Arboledas',
        code: '54051',
      },
      {
        value: 'bochalema_norte_de_santander',
        label: 'Bochalema',
        code: '54099',
      },
      {
        value: 'bucarasica_norte_de_santander',
        label: 'Bucarasica',
        code: '54109',
      },
      {
        value: 'cachira_norte_de_santander',
        label: 'Cáchira',
        code: '54128',
      },
      {
        value: 'cacota_norte_de_santander',
        label: 'Cácota',
        code: '54125',
      },
      {
        value: 'chinacota_norte_de_santander',
        label: 'Chinácota',
        code: '54172',
      },
      {
        value: 'chitaga_norte_de_santander',
        label: 'Chitagá',
        code: '54174',
      },
      {
        value: 'convencion_norte_de_santander',
        label: 'Convención',
        code: '54206',
      },
      {
        value: 'cucutilla_norte_de_santander',
        label: 'Cucutilla',
        code: '54223',
      },
      {
        value: 'durania_norte_de_santander',
        label: 'Durania',
        code: '54239',
      },
      {
        value: 'el_carmen_norte_de_santander',
        label: 'El Carmen',
        code: '54245',
      },
      {
        value: 'el_tarra_norte_de_santander',
        label: 'El Tarra',
        code: '54250',
      },
      {
        value: 'el_zulia_norte_de_santander',
        label: 'El Zulia',
        code: '54261',
      },
      {
        value: 'gramalote_norte_de_santander',
        label: 'Gramalote',
        code: '54313',
      },
      {
        value: 'hacari_norte_de_santander',
        label: 'Hacarí',
        code: '54344',
      },
      {
        value: 'herran_norte_de_santander',
        label: 'Herrán',
        code: '54347',
      },
      {
        value: 'la_esperanza_norte_de_santander',
        label: 'La Esperanza',
        code: '54385',
      },
      {
        value: 'la_playa_norte_de_santander',
        label: 'La Playa',
        code: '54398',
      },
      {
        value: 'labateca_norte_de_santander',
        label: 'Labateca',
        code: '54377',
      },
      {
        value: 'los_patios_norte_de_santander',
        label: 'Los Patios',
        code: '54405',
      },
      {
        value: 'lourdes_norte_de_santander',
        label: 'Lourdes',
        code: '54418',
      },
      {
        value: 'mutiscua_norte_de_santander',
        label: 'Mutiscua',
        code: '54480',
      },
      {
        value: 'ocana_norte_de_santander',
        label: 'Ocaña',
        code: '54498',
      },
      {
        value: 'pamplona_norte_de_santander',
        label: 'Pamplona',
        code: '54518',
      },
      {
        value: 'pamplonita_norte_de_santander',
        label: 'Pamplonita',
        code: '54520',
      },
      {
        value: 'puerto_santander_norte_de_santander',
        label: 'Puerto Santander',
        code: '54553',
      },
      {
        value: 'ragonvalia_norte_de_santander',
        label: 'Ragonvalia',
        code: '54599',
      },
      {
        value: 'salazar_norte_de_santander',
        label: 'Salazar',
        code: '54660',
      },
      {
        value: 'san_calixto_norte_de_santander',
        label: 'San Calixto',
        code: '54670',
      },
      {
        value: 'san_cayetano_norte_de_santander',
        label: 'San Cayetano',
        code: '54673',
      },
      {
        value: 'san_jose_de_cucuta_norte_de_santander',
        label: 'San José De Cúcuta',
        code: '54001',
      },
      {
        value: 'santiago_norte_de_santander',
        label: 'Santiago',
        code: '54680',
      },
      {
        value: 'sardinata_norte_de_santander',
        label: 'Sardinata',
        code: '54720',
      },
      {
        value: 'silos_norte_de_santander',
        label: 'Silos',
        code: '54743',
      },
      {
        value: 'teorama_norte_de_santander',
        label: 'Teorama',
        code: '54800',
      },
      {
        value: 'tibu_norte_de_santander',
        label: 'Tibú',
        code: '54810',
      },
      {
        value: 'toledo_norte_de_santander',
        label: 'Toledo',
        code: '54820',
      },
      {
        value: 'villa_caro_norte_de_santander',
        label: 'Villa Caro',
        code: '54871',
      },
      {
        value: 'villa_del_rosario_norte_de_santander',
        label: 'Villa Del Rosario',
        code: '54874',
      },
    ],
  },
  {
    value: 'putumayo',
    label: 'Putumayo',
    code: '86',
    cities: [
      {
        value: 'colon_putumayo',
        label: 'Colón',
        code: '86219',
      },
      {
        value: 'mocoa_putumayo',
        label: 'Mocoa',
        code: '86001',
      },
      {
        value: 'orito_putumayo',
        label: 'Orito',
        code: '86320',
      },
      {
        value: 'puerto_asis_putumayo',
        label: 'Puerto Asís',
        code: '86568',
      },
      {
        value: 'puerto_caicedo_putumayo',
        label: 'Puerto Caicedo',
        code: '86569',
      },
      {
        value: 'puerto_guzman_putumayo',
        label: 'Puerto Guzmán',
        code: '86571',
      },
      {
        value: 'puerto_leguizamo_putumayo',
        label: 'Puerto Leguízamo',
        code: '86573',
      },
      {
        value: 'san_francisco_putumayo',
        label: 'San Francisco',
        code: '86755',
      },
      {
        value: 'san_miguel_putumayo',
        label: 'San Miguel',
        code: '86757',
      },
      {
        value: 'santiago_putumayo',
        label: 'Santiago',
        code: '86760',
      },
      {
        value: 'sibundoy_putumayo',
        label: 'Sibundoy',
        code: '86749',
      },
      {
        value: 'valle_del_guamuez_putumayo',
        label: 'Valle Del Guamuez',
        code: '86865',
      },
      {
        value: 'villagarzon_putumayo',
        label: 'Villagarzón',
        code: '86885',
      },
    ],
  },
  {
    value: 'quindio',
    label: 'Quindío',
    code: '63',
    cities: [
      {
        value: 'armenia_quindio',
        label: 'Armenia',
        code: '63001',
      },
      {
        value: 'buenavista_quindio',
        label: 'Buenavista',
        code: '63111',
      },
      {
        value: 'calarca_quindio',
        label: 'Calarcá',
        code: '63130',
      },
      {
        value: 'circasia_quindio',
        label: 'Circasia',
        code: '63190',
      },
      {
        value: 'cordoba_quindio',
        label: 'Córdoba',
        code: '63212',
      },
      {
        value: 'filandia_quindio',
        label: 'Filandia',
        code: '63272',
      },
      {
        value: 'genova_quindio',
        label: 'Génova',
        code: '63302',
      },
      {
        value: 'la_tebaida_quindio',
        label: 'La Tebaida',
        code: '63401',
      },
      {
        value: 'montenegro_quindio',
        label: 'Montenegro',
        code: '63470',
      },
      {
        value: 'pijao_quindio',
        label: 'Pijao',
        code: '63548',
      },
      {
        value: 'quimbaya_quindio',
        label: 'Quimbaya',
        code: '63594',
      },
      {
        value: 'salento_quindio',
        label: 'Salento',
        code: '63690',
      },
    ],
  },
  {
    value: 'risaralda',
    label: 'Risaralda',
    code: '66',
    cities: [
      {
        value: 'apia_risaralda',
        label: 'Apía',
        code: '66045',
      },
      {
        value: 'balboa_risaralda',
        label: 'Balboa',
        code: '66075',
      },
      {
        value: 'belen_de_umbria_risaralda',
        label: 'Belén De Umbría',
        code: '66088',
      },
      {
        value: 'dosquebradas_risaralda',
        label: 'Dosquebradas',
        code: '66170',
      },
      {
        value: 'guatica_risaralda',
        label: 'Guática',
        code: '66318',
      },
      {
        value: 'la_celia_risaralda',
        label: 'La Celia',
        code: '66383',
      },
      {
        value: 'la_virginia_risaralda',
        label: 'La Virginia',
        code: '66400',
      },
      {
        value: 'marsella_risaralda',
        label: 'Marsella',
        code: '66440',
      },
      {
        value: 'mistrato_risaralda',
        label: 'Mistrató',
        code: '66456',
      },
      {
        value: 'pereira_risaralda',
        label: 'Pereira',
        code: '66001',
      },
      {
        value: 'pueblo_rico_risaralda',
        label: 'Pueblo Rico',
        code: '66572',
      },
      {
        value: 'quinchia_risaralda',
        label: 'Quinchía',
        code: '66594',
      },
      {
        value: 'santa_rosa_de_cabal_risaralda',
        label: 'Santa Rosa De Cabal',
        code: '66682',
      },
      {
        value: 'santuario_risaralda',
        label: 'Santuario',
        code: '66687',
      },
    ],
  },
  {
    value: 'san_andres_providencia_y_santa_catalina',
    label: 'San Andrés, Providencia y Santa Catalina',
    code: '88',
    cities: [
      {
        value: 'providencia_san_andres_providencia_y_santa_catalina',
        label: 'Providencia',
        code: '88564',
      },
      {
        value: 'san_andres_san_andres_providencia_y_santa_catalina',
        label: 'San Andrés',
        code: '88001',
      },
    ],
  },
  {
    value: 'santander',
    label: 'Santander',
    code: '68',
    cities: [
      {
        value: 'aguada_santander',
        label: 'Aguada',
        code: '68013',
      },
      {
        value: 'albania_santander',
        label: 'Albania',
        code: '68020',
      },
      {
        value: 'aratoca_santander',
        label: 'Aratoca',
        code: '68051',
      },
      {
        value: 'barbosa_santander',
        label: 'Barbosa',
        code: '68077',
      },
      {
        value: 'barichara_santander',
        label: 'Barichara',
        code: '68079',
      },
      {
        value: 'barrancabermeja_santander',
        label: 'Barrancabermeja',
        code: '68081',
      },
      {
        value: 'betulia_santander',
        label: 'Betulia',
        code: '68092',
      },
      {
        value: 'bolivar_santander',
        label: 'Bolívar',
        code: '68101',
      },
      {
        value: 'bucaramanga_santander',
        label: 'Bucaramanga',
        code: '68001',
      },
      {
        value: 'cabrera_santander',
        label: 'Cabrera',
        code: '68121',
      },
      {
        value: 'california_santander',
        label: 'California',
        code: '68132',
      },
      {
        value: 'capitanejo_santander',
        label: 'Capitanejo',
        code: '68147',
      },
      {
        value: 'carcasi_santander',
        label: 'Carcasí',
        code: '68152',
      },
      {
        value: 'cepita_santander',
        label: 'Cepitá',
        code: '68160',
      },
      {
        value: 'cerrito_santander',
        label: 'Cerrito',
        code: '68162',
      },
      {
        value: 'charala_santander',
        label: 'Charalá',
        code: '68167',
      },
      {
        value: 'charta_santander',
        label: 'Charta',
        code: '68169',
      },
      {
        value: 'chima_santander',
        label: 'Chima',
        code: '68176',
      },
      {
        value: 'chipata_santander',
        label: 'Chipatá',
        code: '68179',
      },
      {
        value: 'cimitarra_santander',
        label: 'Cimitarra',
        code: '68190',
      },
      {
        value: 'concepcion_santander',
        label: 'Concepción',
        code: '68207',
      },
      {
        value: 'confines_santander',
        label: 'Confines',
        code: '68209',
      },
      {
        value: 'contratacion_santander',
        label: 'Contratación',
        code: '68211',
      },
      {
        value: 'coromoro_santander',
        label: 'Coromoro',
        code: '68217',
      },
      {
        value: 'curiti_santander',
        label: 'Curití',
        code: '68229',
      },
      {
        value: 'el_carmen_de_chucuri_santander',
        label: 'El Carmen De Chucuri',
        code: '68235',
      },
      {
        value: 'el_guacamayo_santander',
        label: 'El Guacamayo',
        code: '68245',
      },
      {
        value: 'el_penon_santander',
        label: 'El Peñón',
        code: '68250',
      },
      {
        value: 'el_playon_santander',
        label: 'El Playón',
        code: '68255',
      },
      {
        value: 'encino_santander',
        label: 'Encino',
        code: '68264',
      },
      {
        value: 'enciso_santander',
        label: 'Enciso',
        code: '68266',
      },
      {
        value: 'florian_santander',
        label: 'Florián',
        code: '68271',
      },
      {
        value: 'floridablanca_santander',
        label: 'Floridablanca',
        code: '68276',
      },
      {
        value: 'galan_santander',
        label: 'Galán',
        code: '68296',
      },
      {
        value: 'gambita_santander',
        label: 'Gámbita',
        code: '68298',
      },
      {
        value: 'giron_santander',
        label: 'Girón',
        code: '68307',
      },
      {
        value: 'guaca_santander',
        label: 'Guaca',
        code: '68318',
      },
      {
        value: 'guadalupe_santander',
        label: 'Guadalupe',
        code: '68320',
      },
      {
        value: 'guapota_santander',
        label: 'Guapotá',
        code: '68322',
      },
      {
        value: 'guavata_santander',
        label: 'Guavatá',
        code: '68324',
      },
      {
        value: 'guepsa_santander',
        label: 'Güepsa',
        code: '68327',
      },
      {
        value: 'hato_santander',
        label: 'Hato',
        code: '68344',
      },
      {
        value: 'jesus_maria_santander',
        label: 'Jesús María',
        code: '68368',
      },
      {
        value: 'jordan_santander',
        label: 'Jordán',
        code: '68370',
      },
      {
        value: 'la_belleza_santander',
        label: 'La Belleza',
        code: '68377',
      },
      {
        value: 'la_paz_santander',
        label: 'La Paz',
        code: '68397',
      },
      {
        value: 'landazuri_santander',
        label: 'Landázuri',
        code: '68385',
      },
      {
        value: 'lebrija_santander',
        label: 'Lebrija',
        code: '68406',
      },
      {
        value: 'los_santos_santander',
        label: 'Los Santos',
        code: '68418',
      },
      {
        value: 'macaravita_santander',
        label: 'Macaravita',
        code: '68425',
      },
      {
        value: 'malaga_santander',
        label: 'Málaga',
        code: '68432',
      },
      {
        value: 'matanza_santander',
        label: 'Matanza',
        code: '68444',
      },
      {
        value: 'mogotes_santander',
        label: 'Mogotes',
        code: '68464',
      },
      {
        value: 'molagavita_santander',
        label: 'Molagavita',
        code: '68468',
      },
      {
        value: 'ocamonte_santander',
        label: 'Ocamonte',
        code: '68498',
      },
      {
        value: 'oiba_santander',
        label: 'Oiba',
        code: '68500',
      },
      {
        value: 'onzaga_santander',
        label: 'Onzaga',
        code: '68502',
      },
      {
        value: 'palmar_santander',
        label: 'Palmar',
        code: '68522',
      },
      {
        value: 'palmas_del_socorro_santander',
        label: 'Palmas Del Socorro',
        code: '68524',
      },
      {
        value: 'paramo_santander',
        label: 'Páramo',
        code: '68533',
      },
      {
        value: 'piedecuesta_santander',
        label: 'Piedecuesta',
        code: '68547',
      },
      {
        value: 'pinchote_santander',
        label: 'Pinchote',
        code: '68549',
      },
      {
        value: 'puente_nacional_santander',
        label: 'Puente Nacional',
        code: '68572',
      },
      {
        value: 'puerto_parra_santander',
        label: 'Puerto Parra',
        code: '68573',
      },
      {
        value: 'puerto_wilches_santander',
        label: 'Puerto Wilches',
        code: '68575',
      },
      {
        value: 'rionegro_santander',
        label: 'Rionegro',
        code: '68615',
      },
      {
        value: 'sabana_de_torres_santander',
        label: 'Sabana De Torres',
        code: '68655',
      },
      {
        value: 'san_andres_santander',
        label: 'San Andrés',
        code: '68669',
      },
      {
        value: 'san_benito_santander',
        label: 'San Benito',
        code: '68673',
      },
      {
        value: 'san_gil_santander',
        label: 'San Gil',
        code: '68679',
      },
      {
        value: 'san_joaquin_santander',
        label: 'San Joaquín',
        code: '68682',
      },
      {
        value: 'san_jose_de_miranda_santander',
        label: 'San José De Miranda',
        code: '68684',
      },
      {
        value: 'san_miguel_santander',
        label: 'San Miguel',
        code: '68686',
      },
      {
        value: 'san_vicente_de_chucuri_santander',
        label: 'San Vicente De Chucurí',
        code: '68689',
      },
      {
        value: 'santa_barbara_santander',
        label: 'Santa Bárbara',
        code: '68705',
      },
      {
        value: 'santa_helena_del_opon_santander',
        label: 'Santa Helena Del Opón',
        code: '68720',
      },
      {
        value: 'simacota_santander',
        label: 'Simacota',
        code: '68745',
      },
      {
        value: 'socorro_santander',
        label: 'Socorro',
        code: '68755',
      },
      {
        value: 'suaita_santander',
        label: 'Suaita',
        code: '68770',
      },
      {
        value: 'sucre_santander',
        label: 'Sucre',
        code: '68773',
      },
      {
        value: 'surata_santander',
        label: 'Suratá',
        code: '68780',
      },
      {
        value: 'tona_santander',
        label: 'Tona',
        code: '68820',
      },
      {
        value: 'valle_de_san_jose_santander',
        label: 'Valle De San José',
        code: '68855',
      },
      {
        value: 'velez_santander',
        label: 'Vélez',
        code: '68861',
      },
      {
        value: 'vetas_santander',
        label: 'Vetas',
        code: '68867',
      },
      {
        value: 'villanueva_santander',
        label: 'Villanueva',
        code: '68872',
      },
      {
        value: 'zapatoca_santander',
        label: 'Zapatoca',
        code: '68895',
      },
    ],
  },
  {
    value: 'sucre',
    label: 'Sucre',
    code: '70',
    cities: [
      {
        value: 'buenavista_sucre',
        label: 'Buenavista',
        code: '70110',
      },
      {
        value: 'caimito_sucre',
        label: 'Caimito',
        code: '70124',
      },
      {
        value: 'chalan_sucre',
        label: 'Chalán',
        code: '70230',
      },
      {
        value: 'coloso_sucre',
        label: 'Colosó',
        code: '70204',
      },
      {
        value: 'corozal_sucre',
        label: 'Corozal',
        code: '70215',
      },
      {
        value: 'covenas_sucre',
        label: 'Coveñas',
        code: '70221',
      },
      {
        value: 'el_roble_sucre',
        label: 'El Roble',
        code: '70233',
      },
      {
        value: 'galeras_sucre',
        label: 'Galeras',
        code: '70235',
      },
      {
        value: 'guaranda_sucre',
        label: 'Guaranda',
        code: '70265',
      },
      {
        value: 'la_union_sucre',
        label: 'La Unión',
        code: '70400',
      },
      {
        value: 'los_palmitos_sucre',
        label: 'Los Palmitos',
        code: '70418',
      },
      {
        value: 'majagual_sucre',
        label: 'Majagual',
        code: '70429',
      },
      {
        value: 'morroa_sucre',
        label: 'Morroa',
        code: '70473',
      },
      {
        value: 'ovejas_sucre',
        label: 'Ovejas',
        code: '70508',
      },
      {
        value: 'palmito_sucre',
        label: 'Palmito',
        code: '70523',
      },
      {
        value: 'sampues_sucre',
        label: 'Sampués',
        code: '70670',
      },
      {
        value: 'san_benito_abad_sucre',
        label: 'San Benito Abad',
        code: '70678',
      },
      {
        value: 'san_jose_de_toluviejo_sucre',
        label: 'San José De Toluviejo',
        code: '70823',
      },
      {
        value: 'san_juan_de_betulia_sucre',
        label: 'San Juan De Betulia',
        code: '70702',
      },
      {
        value: 'san_luis_de_since_sucre',
        label: 'San Luis De Sincé',
        code: '70742',
      },
      {
        value: 'san_marcos_sucre',
        label: 'San Marcos',
        code: '70708',
      },
      {
        value: 'san_onofre_sucre',
        label: 'San Onofre',
        code: '70713',
      },
      {
        value: 'san_pedro_sucre',
        label: 'San Pedro',
        code: '70717',
      },
      {
        value: 'santiago_de_tolu_sucre',
        label: 'Santiago De Tolú',
        code: '70820',
      },
      {
        value: 'sincelejo_sucre',
        label: 'Sincelejo',
        code: '70001',
      },
      {
        value: 'sucre_sucre',
        label: 'Sucre',
        code: '70771',
      },
    ],
  },
  {
    value: 'tolima',
    label: 'Tolima',
    code: '73',
    cities: [
      {
        value: 'alpujarra_tolima',
        label: 'Alpujarra',
        code: '73024',
      },
      {
        value: 'alvarado_tolima',
        label: 'Alvarado',
        code: '73026',
      },
      {
        value: 'ambalema_tolima',
        label: 'Ambalema',
        code: '73030',
      },
      {
        value: 'anzoategui_tolima',
        label: 'Anzoátegui',
        code: '73043',
      },
      {
        value: 'armero_tolima',
        label: 'Armero',
        code: '73055',
      },
      {
        value: 'ataco_tolima',
        label: 'Ataco',
        code: '73067',
      },
      {
        value: 'cajamarca_tolima',
        label: 'Cajamarca',
        code: '73124',
      },
      {
        value: 'carmen_de_apicala_tolima',
        label: 'Carmen De Apicalá',
        code: '73148',
      },
      {
        value: 'casabianca_tolima',
        label: 'Casabianca',
        code: '73152',
      },
      {
        value: 'chaparral_tolima',
        label: 'Chaparral',
        code: '73168',
      },
      {
        value: 'coello_tolima',
        label: 'Coello',
        code: '73200',
      },
      {
        value: 'coyaima_tolima',
        label: 'Coyaima',
        code: '73217',
      },
      {
        value: 'cunday_tolima',
        label: 'Cunday',
        code: '73226',
      },
      {
        value: 'dolores_tolima',
        label: 'Dolores',
        code: '73236',
      },
      {
        value: 'espinal_tolima',
        label: 'Espinal',
        code: '73268',
      },
      {
        value: 'falan_tolima',
        label: 'Falan',
        code: '73270',
      },
      {
        value: 'flandes_tolima',
        label: 'Flandes',
        code: '73275',
      },
      {
        value: 'fresno_tolima',
        label: 'Fresno',
        code: '73283',
      },
      {
        value: 'guamo_tolima',
        label: 'Guamo',
        code: '73319',
      },
      {
        value: 'herveo_tolima',
        label: 'Herveo',
        code: '73347',
      },
      {
        value: 'honda_tolima',
        label: 'Honda',
        code: '73349',
      },
      {
        value: 'ibague_tolima',
        label: 'Ibagué',
        code: '73001',
      },
      {
        value: 'icononzo_tolima',
        label: 'Icononzo',
        code: '73352',
      },
      {
        value: 'lerida_tolima',
        label: 'Lérida',
        code: '73408',
      },
      {
        value: 'libano_tolima',
        label: 'Líbano',
        code: '73411',
      },
      {
        value: 'melgar_tolima',
        label: 'Melgar',
        code: '73449',
      },
      {
        value: 'murillo_tolima',
        label: 'Murillo',
        code: '73461',
      },
      {
        value: 'natagaima_tolima',
        label: 'Natagaima',
        code: '73483',
      },
      {
        value: 'ortega_tolima',
        label: 'Ortega',
        code: '73504',
      },
      {
        value: 'palocabildo_tolima',
        label: 'Palocabildo',
        code: '73520',
      },
      {
        value: 'piedras_tolima',
        label: 'Piedras',
        code: '73547',
      },
      {
        value: 'planadas_tolima',
        label: 'Planadas',
        code: '73555',
      },
      {
        value: 'prado_tolima',
        label: 'Prado',
        code: '73563',
      },
      {
        value: 'purificacion_tolima',
        label: 'Purificación',
        code: '73585',
      },
      {
        value: 'rioblanco_tolima',
        label: 'Rioblanco',
        code: '73616',
      },
      {
        value: 'roncesvalles_tolima',
        label: 'Roncesvalles',
        code: '73622',
      },
      {
        value: 'rovira_tolima',
        label: 'Rovira',
        code: '73624',
      },
      {
        value: 'saldana_tolima',
        label: 'Saldaña',
        code: '73671',
      },
      {
        value: 'san_antonio_tolima',
        label: 'San Antonio',
        code: '73675',
      },
      {
        value: 'san_luis_tolima',
        label: 'San Luis',
        code: '73678',
      },
      {
        value: 'san_sebastian_de_mariquita_tolima',
        label: 'San Sebastián De Mariquita',
        code: '73443',
      },
      {
        value: 'santa_isabel_tolima',
        label: 'Santa Isabel',
        code: '73686',
      },
      {
        value: 'suarez_tolima',
        label: 'Suárez',
        code: '73770',
      },
      {
        value: 'valle_de_san_juan_tolima',
        label: 'Valle De San Juan',
        code: '73854',
      },
      {
        value: 'venadillo_tolima',
        label: 'Venadillo',
        code: '73861',
      },
      {
        value: 'villahermosa_tolima',
        label: 'Villahermosa',
        code: '73870',
      },
      {
        value: 'villarrica_tolima',
        label: 'Villarrica',
        code: '73873',
      },
    ],
  },
  {
    value: 'valle_del_cauca',
    label: 'Valle Del Cauca',
    code: '76',
    cities: [
      {
        value: 'alcala_valle_del_cauca',
        label: 'Alcalá',
        code: '76020',
      },
      {
        value: 'andalucia_valle_del_cauca',
        label: 'Andalucía',
        code: '76036',
      },
      {
        value: 'ansermanuevo_valle_del_cauca',
        label: 'Ansermanuevo',
        code: '76041',
      },
      {
        value: 'argelia_valle_del_cauca',
        label: 'Argelia',
        code: '76054',
      },
      {
        value: 'bolivar_valle_del_cauca',
        label: 'Bolívar',
        code: '76100',
      },
      {
        value: 'buenaventura_valle_del_cauca',
        label: 'Buenaventura',
        code: '76109',
      },
      {
        value: 'bugalagrande_valle_del_cauca',
        label: 'Bugalagrande',
        code: '76113',
      },
      {
        value: 'caicedonia_valle_del_cauca',
        label: 'Caicedonia',
        code: '76122',
      },
      {
        value: 'cali_valle_del_cauca',
        label: 'Cali',
        code: '76001',
      },
      {
        value: 'calima_valle_del_cauca',
        label: 'Calima',
        code: '76126',
      },
      {
        value: 'candelaria_valle_del_cauca',
        label: 'Candelaria',
        code: '76130',
      },
      {
        value: 'cartago_valle_del_cauca',
        label: 'Cartago',
        code: '76147',
      },
      {
        value: 'dagua_valle_del_cauca',
        label: 'Dagua',
        code: '76233',
      },
      {
        value: 'el_aguila_valle_del_cauca',
        label: 'El Águila',
        code: '76243',
      },
      {
        value: 'el_cairo_valle_del_cauca',
        label: 'El Cairo',
        code: '76246',
      },
      {
        value: 'el_cerrito_valle_del_cauca',
        label: 'El Cerrito',
        code: '76248',
      },
      {
        value: 'el_dovio_valle_del_cauca',
        label: 'El Dovio',
        code: '76250',
      },
      {
        value: 'florida_valle_del_cauca',
        label: 'Florida',
        code: '76275',
      },
      {
        value: 'ginebra_valle_del_cauca',
        label: 'Ginebra',
        code: '76306',
      },
      {
        value: 'guacari_valle_del_cauca',
        label: 'Guacarí',
        code: '76318',
      },
      {
        value: 'guadalajara_de_buga_valle_del_cauca',
        label: 'Guadalajara De Buga',
        code: '76111',
      },
      {
        value: 'jampionamedi_valle_del_cauca',
        label: 'Jampionamedí',
        code: '76364',
      },
      {
        value: 'la_cumbre_valle_del_cauca',
        label: 'La Cumbre',
        code: '76377',
      },
      {
        value: 'la_union_valle_del_cauca',
        label: 'La Unión',
        code: '76400',
      },
      {
        value: 'la_victoria_valle_del_cauca',
        label: 'La Victoria',
        code: '76403',
      },
      {
        value: 'obando_valle_del_cauca',
        label: 'Obando',
        code: '76497',
      },
      {
        value: 'palmira_valle_del_cauca',
        label: 'Palmira',
        code: '76520',
      },
      {
        value: 'pradera_valle_del_cauca',
        label: 'Pradera',
        code: '76563',
      },
      {
        value: 'restrepo_valle_del_cauca',
        label: 'Restrepo',
        code: '76606',
      },
      {
        value: 'riofrio_valle_del_cauca',
        label: 'Riofrío',
        code: '76616',
      },
      {
        value: 'roldanillo_valle_del_cauca',
        label: 'Roldanillo',
        code: '76622',
      },
      {
        value: 'san_pedro_valle_del_cauca',
        label: 'San Pedro',
        code: '76670',
      },
      {
        value: 'sevilla_valle_del_cauca',
        label: 'Sevilla',
        code: '76736',
      },
      {
        value: 'toro_valle_del_cauca',
        label: 'Toro',
        code: '76823',
      },
      {
        value: 'trujillo_valle_del_cauca',
        label: 'Trujillo',
        code: '76828',
      },
      {
        value: 'tulua_valle_del_cauca',
        label: 'Tuluá',
        code: '76834',
      },
      {
        value: 'ulloa_valle_del_cauca',
        label: 'Ulloa',
        code: '76845',
      },
      {
        value: 'versalles_valle_del_cauca',
        label: 'Versalles',
        code: '76863',
      },
      {
        value: 'vijes_valle_del_cauca',
        label: 'Vijes',
        code: '76869',
      },
      {
        value: 'yotoco_valle_del_cauca',
        label: 'Yotoco',
        code: '76890',
      },
      {
        value: 'yumbo_valle_del_cauca',
        label: 'Yumbo',
        code: '76892',
      },
      {
        value: 'zarzal_valle_del_cauca',
        label: 'Zarzal',
        code: '76895',
      },
    ],
  },
  {
    value: 'vaupes',
    label: 'Vaupés',
    code: '97',
    cities: [
      {
        value: 'caruru_vaupes',
        label: 'Carurú',
        code: '97161',
      },
      {
        value: 'mitu_vaupes',
        label: 'Mitú',
        code: '97001',
      },
      {
        value: 'pacoa_vaupes',
        label: 'Pacoa',
        code: '97511',
      },
      {
        value: 'papunahua_vaupes',
        label: 'Papunahua',
        code: '97777',
      },
      {
        value: 'taraira_vaupes',
        label: 'Taraira',
        code: '97666',
      },
      {
        value: 'yavarate_vaupes',
        label: 'Yavaraté',
        code: '97889',
      },
    ],
  },
  {
    value: 'vichada',
    label: 'Vichada',
    code: '99',
    cities: [
      {
        value: 'cumaribo_vichada',
        label: 'Cumaribo',
        code: '99773',
      },
      {
        value: 'la_primavera_vichada',
        label: 'La Primavera',
        code: '99524',
      },
      {
        value: 'puerto_carreno_vichada',
        label: 'Puerto Carreño',
        code: '99001',
      },
      {
        value: 'santa_rosalia_vichada',
        label: 'Santa Rosalía',
        code: '99624',
      },
    ],
  },
];

export const DEFAULT_COUNTRY = 'Colombia';

// ---------- Vistas derivadas (no dupliques datos, deriva de COLOMBIA_DEPARTMENTS) ----------

export interface FlatColombianCity {
  value: string;
  label: string;
  department: string;
  code: string;
}

/**
 * Aplana COLOMBIA_DEPARTMENTS a una lista plana de ciudades con su
 * departamento incluido. Úsalo en selects simples (ej. filtro de reportes)
 * en vez de mantener una segunda lista hardcodeada.
 */
export function getAllColombianCities(): FlatColombianCity[] {
  return COLOMBIA_DEPARTMENTS.flatMap((department) =>
    department.cities.map((city) => ({
      value: city.value,
      label: city.label,
      department: department.label,
      code: city.code,
    })),
  );
}

/** Busca un departamento por su value (slug). */
export function getDepartmentByValue(value: string): ColombianDepartment | undefined {
  return COLOMBIA_DEPARTMENTS.find((d) => d.value === value);
}

/** Devuelve las ciudades de un departamento dado su value (slug). Útil para
 * selects en cascada: país -> departamento -> ciudad. */
export function getCitiesByDepartment(departmentValue: string): ColombianCity[] {
  return getDepartmentByValue(departmentValue)?.cities ?? [];
}
