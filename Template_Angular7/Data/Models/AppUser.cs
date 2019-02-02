using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Template_Angular7.Data
{
    public class AppUser
    {
        #region Constructor
        public AppUser()
        {
        }
        #endregion
        
        #region Properties
        [Key]
        [Required]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(128)]
        public string UserName { get; set; }
        
        [Required]
        [MaxLength(128)]
        public string Email { get; set; }
        
        [Required]
        [MaxLength(128)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(128)]
        public string LastName { get; set; }
        
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
      
        
        [Required]
        public DateTime CreatedDate { get; set; }
        
        [Required]
        public DateTime LastModifiedDate { get; set; }
        #endregion
        
        #region Lazy-Load Properties
        /// <summary>
        /// A list of all the quiz created by this users.
        /// </summary>
        public virtual List<Gruppe> Gruppen { get; set; }
        #endregion
    }
}