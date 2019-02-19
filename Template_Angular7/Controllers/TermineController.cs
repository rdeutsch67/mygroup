using System;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Template_Angular7.ViewModels;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading;
using Template_Angular7.Data;
using Template_Angular7.Controllers;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design.Internal;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Remotion.Linq.Clauses;

namespace Template_Angular7.Controllers
{
    [Route("api/[controller]")]
    public class TermineController : BaseApiController
    {
        #region Constructor
        public TermineController(ApplicationDbContext context): base(context) { }
        #endregion Constructor
        
        #region RESTful conventions methods
        /// <summary>
        /// GET: api/termine/{id}
        /// Retrieves the Termin with the given {id}
        /// </summary>
        /// <param name="id">The ID of an existing Termin</param>
        /// <returns>the Aktivität with the given {id}</returns>
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var termin = DbContext.Termine.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden", id)
                });
            }
            
            return new JsonResult(
                termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// neuen Termin in die DB eintragen
        /// </summary>
        /// <param name="model">The TerminViewModel containing the data to insert</param>
        [HttpPut]
        public IActionResult Put([FromBody]TerminViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // handle the insert (without object-mapping)
            var termin = new Termin();
            
            // properties taken from the request
            termin.IdTermin = model.IdTermin;
            termin.IdGruppe = model.IdGruppe;
            termin.IdTeilnehmer = model.IdTeilnehmer;
            termin.IdAktivitaet = model.IdAktivitaet;
            termin.GanzerTag = model.GanzerTag;
            termin.DatumBeginn = model.DatumBeginn.ToLocalTime();
            termin.DatumEnde = model.DatumEnde.ToLocalTime();
            termin.Hinweis = model.Hinweis;
            
            // properties set from server-side
            termin.CreatedDate = DateTime.Now;
            termin.LastModifiedDate = termin.CreatedDate;
            // add the new quiz
            DbContext.Termine.Add(termin);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return the newly-created Quiz to the client.
            return new JsonResult(termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Termin anhand der {id} editieren
        /// </summary>
        /// <param name="model">The TerminViewModel containing the data to update</param>
        [HttpPost]
        public IActionResult Post([FromBody]TerminViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);
            
            // Termin holen 
            var termin = DbContext.Termine.Where(q => q.Id == model.Id).FirstOrDefault();
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden.", model.Id)
                });
            }
            
            // handle the update (without object-mapping)
            // by manually assigning the properties
            // we want to accept from the request
            termin.IdTermin = model.IdTermin;
            termin.IdGruppe = model.IdGruppe;
            termin.IdTeilnehmer = model.IdTeilnehmer;
            termin.IdAktivitaet = model.IdAktivitaet;
            termin.GanzerTag = model.GanzerTag;
            termin.DatumBeginn = model.DatumBeginn.ToLocalTime();
            termin.DatumEnde = model.DatumEnde.ToLocalTime();
            termin.Hinweis = model.Hinweis;
            
            // properties set from server-side
            termin.LastModifiedDate = termin.CreatedDate;
            
            // persist the changes into the Database.
            DbContext.SaveChanges();
            
            // return the updated Quiz to the client.
            return new JsonResult(termin.Adapt<TerminViewModel>(),
                new JsonSerializerSettings()
                {
                    Formatting = Formatting.Indented
                });
        }
        
        /// <summary>
        /// Löscht einen Termin über die {id} auf der DB
        /// </summary>
        /// <param name="id">The ID of an existing Termin</param>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // retrieve the quiz from the Database
            var termin = DbContext.Termine.FirstOrDefault(i => i.Id == id);
            
            // handle requests asking for non-existing quizzes
            if (termin == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Termin ID {0} nicht gefunden.", id)
                });
            }
            
            // Termin vom DBContext löschen
            DbContext.Termine.Remove(termin);
            // persist the changes into the Database.
            DbContext.SaveChanges();
            // return an HTTP Status 200 (OK).
            return new OkResult();
        }
        #endregion
        
        // GET api/gruppen/alle
        [HttpGet("alle/{idGruppe}")]
        public IActionResult alle(int idGruppe)
        {
            if (idGruppe > 0)
            {
                var termine = DbContext.Termine
                    .Where(q => q.IdGruppe == idGruppe)
                    .OrderBy(q => q.DatumBeginn)
                    .ToArray();
                return new JsonResult(
                    termine.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            else
            {   // alle Aktiviäten
                var termine = DbContext.Termine
                    .OrderBy(q => q.IdGruppe).ThenBy(q => q.DatumBeginn)    
                    .ToArray();
                return new JsonResult(
                    termine.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            
            
        }
        
        // GET 
        [HttpGet("vtermine/{idGruppe}")]
        public IActionResult vtermine(int idGruppe)
        {
            if (idGruppe > 0)
            {
                var query = (from ut in DbContext.Termine
                             from ua in DbContext.CodesAktivitaeten.Where(x => x.Id == ut.IdAktivitaet).DefaultIfEmpty()
                             from uu in DbContext.Teilnehmer.Where(x => x.Id == ut.IdTeilnehmer).DefaultIfEmpty()
                             from ug in DbContext.Gruppen.Where(x => x.Id == ut.IdGruppe).DefaultIfEmpty()
                             where ut.IdGruppe == idGruppe
                             select new
                             {
                                 ut.Id,
                                 ut.IdTermin,
                                 ut.IdGruppe,
                                 ut.IdTeilnehmer,
                                 ut.IdAktivitaet,
                                 ut.GanzerTag,
                                 ut.DatumBeginn,
                                 ut.DatumEnde,
                                 ut.Hinweis,
                                 ut.CreatedDate,
                                 ut.LastModifiedDate,
                                 TerminDatum = ut.DatumBeginn.Date,
                                 AktFarbe = ua.Farbe,
                                 AktCode = ua.Code,
                                 AktBezeichnung = ua.Bezeichnung,
                                 AktSummieren = ua.Summieren,
                                 AktSort = ua.Sort,
                                 TnVorname = uu.Vorname,
                                 TnNachname = uu.Nachname,
                                 TnEmail = uu.Email,
                                 GrpCode = ug.Code,
                                 GrpBezeichnung = ug.Bezeichnung
                             }).OrderBy(x => x.DatumBeginn.Date).ThenBy(x => x.AktSort).ThenBy(x => x.TnVorname)
                               .ToList();
                return new JsonResult(
                    query.Adapt<TerminViewModel[]>(),
                    JsonSettings);    
            }
            else
            {
                var query = (from ut in DbContext.Termine
                             from ua in DbContext.CodesAktivitaeten.Where(x => x.Id == ut.IdAktivitaet).DefaultIfEmpty()
                             from uu in DbContext.Teilnehmer.Where(x => x.Id == ut.IdTeilnehmer).DefaultIfEmpty()
                             from ug in DbContext.Gruppen.Where(x => x.Id == ut.IdGruppe).DefaultIfEmpty()
                    select new
                    {
                        ut.Id,
                        ut.IdTermin,
                        ut.IdGruppe,
                        ut.IdTeilnehmer,
                        ut.IdAktivitaet,
                        ut.GanzerTag,
                        ut.DatumBeginn,
                        ut.DatumEnde,
                        ut.Hinweis,
                        ut.CreatedDate,
                        ut.LastModifiedDate,
                        TerminDatum = ut.DatumBeginn.Date,
                        AktFarbe = ua.Farbe,
                        AktCode = ua.Code,
                        AktBezeichnung = ua.Bezeichnung,
                        AktSummieren = ua.Summieren,
                        AktSort = ua.Sort,
                        TnVorname = uu.Vorname,
                        TnNachname = uu.Nachname,
                        TnEmail = uu.Email,
                        GrpCode = ug.Code,
                        GrpBezeichnung = ug.Bezeichnung
                    }).OrderBy(x => x.DatumBeginn.Date).ThenBy(x => x.AktSort).ThenBy(x => x.TnVorname)
                      .ToList();
                return new JsonResult(
                    query.Adapt<TerminViewModel[]>(),
                    JsonSettings);
            }
            
        }
        
        // GET api/termine_user/{idUser}
        [HttpGet("termine_user/{idUser}")]
        public IActionResult termine_user(int idUser)
        {
            if (idUser <= 0) return new StatusCodeResult(500);
            
            var query = (from ut in DbContext.Termine
                    from ua in DbContext.CodesAktivitaeten.Where(x => x.Id == ut.IdAktivitaet).DefaultIfEmpty()
                    from uu in DbContext.Teilnehmer.Where(x => x.Id == ut.IdTeilnehmer).DefaultIfEmpty()
                    from ug in DbContext.Gruppen.Where(x => x.Id == ut.IdGruppe).DefaultIfEmpty()
                    where ug.IdUser == idUser
                    select new
                    {
                        ut.Id,
                        ut.IdTermin,
                        ut.IdGruppe,
                        ut.IdTeilnehmer,
                        ut.IdAktivitaet,
                        ut.GanzerTag,
                        ut.DatumBeginn,
                        ut.DatumEnde,
                        ut.Hinweis,
                        ut.CreatedDate,
                        ut.LastModifiedDate,
                        TerminDatum = ut.DatumBeginn.Date,
                        AktFarbe = ua.Farbe,
                        AktCode = ua.Code,
                        AktBezeichnung = ua.Bezeichnung,
                        AktSummieren = ua.Summieren,
                        TnVorname = uu.Vorname,
                        TnNachname = uu.Nachname,
                        TnEmail = uu.Email,
                        GrpCode = ug.Code,
                        GrpBezeichnung = ug.Bezeichnung,
                        GruppeUserId = ug.IdUser 
                    }).OrderBy(x => x.GruppeUserId).ThenBy(x => x.DatumBeginn).ThenBy(x => x.DatumEnde)
                      .ToList();
            return new JsonResult(
                query.Adapt<TerminViewModel[]>(),
                JsonSettings);
        }
        
        // GET api/termine_group_date/{idGruppe}
        [HttpGet("termine_group_date/{idGruppe}")]
        public IActionResult termine_group_date(int idGruppe)
        {
            if (idGruppe <= 0) return new StatusCodeResult(500);

            /*
                from p in context.Periods
                join f in context.Facts on p.id equals f.periodid into fg
                from fgi in fg.Where(f => f.otherid == 17).DefaultIfEmpty()
                where p.companyid == 100
                select f.value
                */
            
            //join myTeiln in DbContext.Teilnehmer on myTermine.IdTeilnehmer equals myTeiln.Id
            
            DataTable dt1 = new DataTable();
            dt1.Columns.Add("TerminDatum", typeof(DateTime));
            dt1.Columns.Add("AnzTermine", typeof(int));
            dt1.Columns.Add("AktHeaderBez", typeof(string));
            dt1.Columns.Add("TeilnehmerHeaderName", typeof(string));

            var query = (
                from myTermine in DbContext.Termine
                group myTermine by myTermine.DatumBeginn.Date
                into g
                select new
                {
                    TerminDatum = g.Key
                }).ToList();

            foreach (var item in query)
            {
                
                var query2 = (
                    from myAkt in DbContext.CodesAktivitaeten
                    from myTermine2 in DbContext.Termine
                    where myTermine2.IdAktivitaet == myAkt.Id
                          && myTermine2.DatumBeginn.Date == item.TerminDatum
                          && myAkt.Header == true
                    select new
                    {
                        TerminDatum2 = item.TerminDatum,
                        AktCode = myAkt.Code
                    }
                ).ToList();
                foreach (var item2 in query2)
                {
                    DataRow row = dt1.NewRow();
                    row["TerminDatum"] = item2.TerminDatum2;
                    row["AnzTermine"] = 1;
                    row["AktHeaderBez"] = item2.AktCode;
                    row["TeilnehmerHeaderName"] = "karl";
                    dt1.Rows.Add(row);
                }
                
            }
                
            
                 //join myTeiln in DbContext.Teilnehmer on myTermine.IdTeilnehmer equals myTeiln.Id
                 /*join myAkt in DbContext.CodesAktivitaeten on new {DID = (int?)myTermine.IdAktivitaet } equals new { DID = (int?)myAkt.Id } into dis   
                 from myAkt in dis.DefaultIfEmpty() 
                 where myAkt.IdGruppe == idGruppe
                       //&& myAkt.Header == true
                 group myTermine by myTermine.DatumBeginn.Date
                 into g      
                 select new  
                    {
                        TerminDatum = myTermine.DatumBeginn.Date,
                        AnzTermine = 1,
                        //AktHeaderBez = "adf",
                        AktHeaderBez = myAkt.Code == null ? "??" : myAkt.Code, 
                        TeilnehmerHeaderName = "karl" //myTeiln.Vorname == null ? "??" : myTeiln.Vorname
                    }).ToList();*/
            
            /*var query =
                (from mytermine in DbContext.Termine
                where mytermine.Teilnehmer.Id == mytermine.IdTeilnehmer
                  && mytermine.CodesAktivitaeten.Id == mytermine.IdAktivitaet
                  && mytermine.CodesAktivitaeten.Header == true
                  && mytermine.IdGruppe == idGruppe
                group mytermine by mytermine.DatumBeginn.Date
                into g
                select new  
                  {
                      TerminDatum = g.Key,
                      AnzTermine = g.Count(),
                      AktHeaderBez = g.Min(x => x.CodesAktivitaeten.Bezeichnung),
                      TeilnehmerHeaderName = g.Min(x => x.Teilnehmer.Vorname)
                      }).OrderBy(x => x.TerminDatum)
                    .ToList();*/
            return new JsonResult(
                //dt1.Adapt<TerminGroupbyDateViewModel[]>(),
                dt1,
                JsonSettings);
        }
    }
}

