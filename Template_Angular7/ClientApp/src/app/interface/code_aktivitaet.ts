interface Code_aktivitaet {
  Id: number;
  Code: string;
  Bezeichnung: string;
  IdGruppe: number;
  Summieren: boolean;
  Farbe: string;
  GanzerTag: boolean;
  ZeitUnbestimmt: boolean;
  ZeitBeginn: Date;
  ZeitEnde: Date;
}

interface VCode_aktivitaet {
  Id: number;
  Code: string;
  Bezeichnung: string;
  IdGruppe: number;
  Summieren: boolean;
  Farbe: string;
  GanzerTag: boolean;
  ZeitUnbestimmt: boolean;
  ZeitBeginn: Date;
  ZeitEnde: Date;

  GruppeCode: string;
  GruppeBezeichnung: string;
  GruppeUserId: string;
  GruppeAktiv: boolean;

  ShowZeiten: boolean;
}

