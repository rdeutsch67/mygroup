using Newtonsoft.Json;
using System;

namespace Template_Angular7.ViewModels
{
    [JsonObject(MemberSerialization.OptOut)]
    public class TerminGroupbyDateViewModel
    {
        #region Constructor
        public TerminGroupbyDateViewModel()
        {
        }
        #endregion
        
        #region Properties
        
        public DateTime TerminDatum { get; set; }
        public int AnzTermine { get; set; }
        public string AktHeaderBez { get; set; }
        public string TeilnehmerHeaderName { get; set; }
        
        #endregion
    }
}