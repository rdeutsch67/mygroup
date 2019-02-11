interface Termin {
  Id: number;
  IdTermin: number;
  IdGruppe: number;
  IdTeilnehmer: number;
  IdAktivitaet: number;
  GanzerTag: boolean;
  DatumBeginn: Date;
  DatumEnde: Date;

  Hinweis: string;
  TerminDatum: Date;

  AktFarbe: string;
  AktCode: string;
  AktBezeichnung: string;
  AktSummieren: boolean;

  TnVorname: string;
  TnNachname: string;
  TnEmail: string;

  GrpCode: string;
  GrpBezeichnung: string;

  CreatedDate: Date;
  LastModifiedDate: Date;
}

interface TerminTeilnehmer {
  TerminDatum: Date;
  AnzTermine: number;
  AktHeaderBez: string;
  TeilnehmerHeaderName: string;
}
