using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore.Query.ExpressionVisitors.Internal;
using Microsoft.Extensions.DependencyInjection;
using Template_Angular7.Services;

namespace Template_Angular7.Data
{
    public static class DBSeeder
    {
        
        #region Public Methods
        public static void Seed(ApplicationDbContext dbContext)
        {
            // Dummy-AppUser Admin erstellen
            if (!dbContext.AppUsers.Any()) CreateAppUser(dbContext);

            // Dummy-Gruppen erstellen
            if (!dbContext.Gruppen.Any()) CreateGruppen(dbContext);
            
            // Dummy Aktivitätscodes erstellen
            if (!dbContext.CodesAktivitaeten.Any()) CreateAktiviaetscodes(dbContext);
            
            // Dummy Teilnehmer erstellen
            if (!dbContext.Teilnehmer.Any()) CreateTeilnehmer(dbContext);
            
            // Dummy Termine erstellen
            if (!dbContext.Termine.Any()) CreateTermine(dbContext);
        }
        #endregion
        
        #region Seed Methods
        // private helper methods

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        
        private static void CreateAppUser(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            // Create the "Admin" AppUser account (if it doesn't exist already)
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash("rde", out passwordHash, out passwordSalt);
            
            var userAdmin = new AppUser()
            {
                UserName = "rde",
                FirstName = "Robert",
                LastName =  "Deutschmann",
                Email = "robert.deutschmann@gmx.ch",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            // Insert the Admin user into the Database
            dbContext.AppUsers.Add(userAdmin);
            dbContext.SaveChanges();
        }
        
        private static void CreateGruppen(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;
            
            // erstelle die erste Demogruppe
            EntityEntry<Gruppe> e2 = dbContext.Gruppen.Add(new Gruppe()
            {
                IdUser = 1,
                Code = "Jassrunde",
                Beschreibung = "Jassrunde mit Trogner Jässler",
                Bezeichnung = "Jassrunde, welche sich aus Trogner Jässler zusammensetzt.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });        
            
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateAktiviaetscodes(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;
            
            var idGruppe = dbContext.Gruppen
                .Where(u => u.Code == "Jassrunde")
                .FirstOrDefault()
                .Id;

            // erstelle Aktivitätencodes
            EntityEntry<CodeAktivitaeten> e1 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                IdGruppe = idGruppe,
                Code = "JT",
                Bezeichnung = "Jasser + Treffpunkt",
                Summieren = false,
                Farbe = "#41f46a",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                Header = true,
                Sort = 1,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e2 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                IdGruppe = idGruppe,
                Code = "Ja",
                Bezeichnung = "Jasser, Teilnehmer",
                Summieren = false,
                Farbe = "#f44141",
                GanzerTag = false,
                ZeitBeginn = new DateTime(createdDate.Year,createdDate.Month,createdDate.Day,19,00,00),
                ZeitEnde = new DateTime(createdDate.Year,createdDate.Month,createdDate.Day,21,00,00),
                Header = false,
                Sort = 2,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e3 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                IdGruppe = idGruppe,
                Code = "Re",
                Bezeichnung = "Reserve, einsetzbar bei Bedarf",
                Summieren = false,
                Farbe = "#4141f4",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                Header = false,
                Sort = 3,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e4 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                IdGruppe = idGruppe,
                Code = "??",
                Bezeichnung = "Klärt noch ab",
                Summieren = false,
                Farbe = "#dc41f4",
                GanzerTag = false,
                ZeitBeginn = new DateTime(2018,01,01,19,00,00),
                ZeitEnde = new DateTime(2018,01,01,21,00,00),
                Header = false,
                Sort = 4,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<CodeAktivitaeten> e5 = dbContext.CodesAktivitaeten.Add(new CodeAktivitaeten()
            {
                IdGruppe = idGruppe,
                Code = "??",
                Bezeichnung = "Jasser-Ausflug",
                Summieren = false,
                Farbe = "#345675",
                GanzerTag = true,
                ZeitBeginn = new DateTime(2018,01,01,00,00,00),
                ZeitEnde = new DateTime(2018,01,01,23,59,59),
                Header = false,
                Sort = 5,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
                    
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateTeilnehmer(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            // retrieve the admin user, which we'll use as default author.
            var gruppenAdmin = dbContext.AppUsers
                .Where(u => u.UserName == "rde")
                .FirstOrDefault();
            
            var idGruppe = 1; // erste Gruppe
            
            // erstelle Admin-Teilnehmer für diese Gruppe 
            EntityEntry<Teilnehmer> e0 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = gruppenAdmin.FirstName,
                Nachname = gruppenAdmin.LastName,
                Rufname = gruppenAdmin.UserName,
                Email = gruppenAdmin.Email,
                EinladungAngenommen = createdDate,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            // erstelle Teilnehmer
            EntityEntry<Teilnehmer> e1 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "Eduard",
                Nachname = "Kozakiewicz",
                Rufname = "Edu",
                Email = "edu.kozakiewicz@ekor.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });

            // erstelle Teilnehmer
            EntityEntry<Teilnehmer> e2 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "Alex",
                Nachname = "Britschgi",
                Rufname = "Alex",
                Email = "alex@xyz.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e3 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "René",
                Nachname = "Graf",
                Rufname = "René",
                Email = "rene@xyz.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e4 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "Thomas",
                Nachname = "Hollenstein",
                Rufname = "Thomas",
                Email = "thomas@xyz.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e5 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "René",
                Nachname = "Keller",
                Rufname = "Keller",
                Email = "keller@xyz.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Teilnehmer> e6 = dbContext.Teilnehmer.Add(new Teilnehmer()
            {
                IdGruppe = idGruppe,
                Vorname = "Hampi",
                Nachname = "Krüsi",
                Rufname = "Hampi",
                Email = "hampi@xyz.ch",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
                    
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        private static void CreateTermine(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = DateTime.Now;
            DateTime lastModifiedDate = DateTime.Now;

            var idGruppe = dbContext.Gruppen
                .Where(u => u.Code == "Jassrunde")
                .FirstOrDefault()
                .Id;

            // erstelle Termine
            EntityEntry<Termin> e1 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = idGruppe,
                IdTeilnehmer = 1,
                IdAktivitaet = 1,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Bin gerne mit dabei.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Termin> e2 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = idGruppe,
                IdTeilnehmer = 2,
                IdAktivitaet = 2,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Bin auch mit dabei.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            EntityEntry<Termin> e3 = dbContext.Termine.Add(new Termin()
            {
                IdGruppe = idGruppe,
                IdTeilnehmer = 3,
                IdAktivitaet = 4,
                GanzerTag = false,
                DatumBeginn = createdDate,
                DatumEnde = createdDate,
                Hinweis = "Mal guggen.",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            
            // persist the changes on the Database
            dbContext.SaveChanges();
        }
        
        #endregion
        
        #region Utility Methods
        /// <summary>
        /// Erstellt Demogruppen und speichert sie auf der Datenbank
        /// </summary>
        /// <param name="userId">Ersteller-ID</param>
        /// <param name="id">Gruppen-ID</param>
        /// <param name="createdDate">CreatedDate</param>
        private static void ErstelleBeispielGruppen(
            ApplicationDbContext dbContext,
            int num,
            int authorId,
            DateTime createdDate)
        {
            var gruppe = new Gruppe()
            {
                IdUser = authorId,
                Code = String.Format("Gruppe {0} Code", num),
                Bezeichnung = String.Format("Beispielgruppe {0}.", num),
                Beschreibung = "Dies ist eine automatisch von DBSeeder erstellte Gruppe.",
                CreatedDate = createdDate,
                LastModifiedDate = createdDate
            };
            dbContext.Gruppen.Add(gruppe);
            dbContext.SaveChanges();
            
        }
        #endregion
    }
}