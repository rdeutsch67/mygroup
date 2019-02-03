interface Teilnehmer {
  Id: number;
  IdGruppe: number;
  Rufname: string;
  Vorname: string;
  Nachname: string;
  Email: string;
  Berechtigungen: number;
  EinladungGesendet: Date;
  EinladungAngenommen: Date;
  Sperrung: Date;
}

interface VTeilnehmer {
  Id: number;
  IdGruppe: number;
  Rufname: string;
  Vorname: string;
  Nachname: string;
  Email: string;
  Berechtigungen: number;
  EinladungGesendet: Date;
  EinladungAngenommen: Date;
  Sperrung: Date;
  GruppeCode: string;
  GruppeBezeichnung: string;
  GruppeUserId: string;
  GruppeAktiv: boolean;
}



