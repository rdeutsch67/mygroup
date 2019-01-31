interface Teilnehmer {
  Id: number;
  IdGruppe: number;
  Vorname: string;
  Nachname: string;
  Berechtigungen: number;
}

interface VTeilnehmer {
  Id: number;
  IdGruppe: number;
  Vorname: string;
  Nachname: string;
  Berechtigungen: number;

  GruppeCode: string;
  GruppeBezeichnung: string;
  GruppeUserId: string;
  GruppeAktiv: boolean;
}



