# Song Bihdays
Song bihdays [[_sic_]](https://en.wikipedia.org/wiki/Sic) for all! Updated annually (or every 6 months).

Only focuses on song birthdays (mostly release dates) in the English Wikipedia. Not much about artists (whose birthdays should be reasonably easier to gather for birthday websites to be trustworthy), musical events and albums (though might add that one later on). Also may include songs with unknown/unspecific release dates, but these would only be mentioned in a separate category.

Made this because other song birthday websites just aren't complete and omit the majority of songs (including some famous ones like [I Want It That Way](https://en.wikipedia.org/wiki/I_Want_It_That_Way)). Also for fun.

## Todo
* Figure out which wiki categories are needed (and collect all page links under them) ✅
  * [Songs by year](https://en.wikipedia.org/wiki/Category:Songs_by_year)
    * [Eurovision songs by year](https://en.wikipedia.org/wiki/Category:Eurovision_songs_by_year) (some pages like [this](https://en.wikipedia.org/w/index.php?title=What_Love_Is_(song)&oldid=1164588474) are not part of the songs categories themselves)
    * [Year of song missing](https://en.wikipedia.org/wiki/Category:Year_of_song_missing) and [unknown](https://en.wikipedia.org/wiki/Category:Year_of_song_unknown) (just to be complete and safe)
    * Normal individual year categories (of course)
  * [Singles by year](https://en.wikipedia.org/wiki/Category:Singles_by_year) (every single is a song by definition, but **of course** there exist [some songs](https://en.wikipedia.org/w/index.php?title=B_Boy_Baby&oldid=1252921732) which are part of the singles category and not songs)
    * [Debut singles by year](https://en.wikipedia.org/wiki/Category:Debut_singles_by_year) (yes, there still exist [some songs](https://en.wikipedia.org/w/index.php?title=Turn_It_Up_(Chamillionaire_song)&oldid=1257836382) listed as debut singles but nowhere else in the above categories, even though some people have taken it upon themselves to address this (thanks!))
  
    ![Richhoncho contribs](https://github.com/Song-Bihdays/song-bihdays.github.io/blob/main/images/Richhoncho%20contribs.jpg?raw=true)
    * Normal individual year categories (of course)
* Find a way to extract information from [wiki infoboxes](https://en.wikipedia.org/wiki/Help:Infobox) ✅
  * Shoutout to [spencermountain](https://github.com/spencermountain)'s [wtf-wikipedia](https://github.com/spencermountain/wtf_wikipedia), **the only** wikitext parser that correctly handles infoboxes (to my best knowledge). Thanks!
* Deal with [redirects to albums](https://en.wikipedia.org/w/index.php?title=Via_Dolorosa_(song)&oldid=1197232866) or [people](https://en.wikipedia.org/w/index.php?title=N-N-Nineteen_Not_Out&oldid=1257022163) or [Eurovision](https://en.wikipedia.org/w/index.php?title=Cliche_Love_Song&oldid=1075394663) or [other pages](https://en.wikipedia.org/w/index.php?title=Welcome_to_LazyTown&oldid=1206159027) ✅
  * To my best knowledge, redirects to other song pages are [rare](https://en.wikipedia.org/w/index.php?title=Crying_Shame_(Muse_song)&oldid=1143052951) and said song pages are already in the above categories, so redirects will be ignored
* Figure out which infobox attributes are needed (and determine order of importance)
  * [released](https://en.wikipedia.org/w/index.php?title=Die_with_a_Smile&oldid=1262437254), [published](https://en.wikipedia.org/w/index.php?title=Ekla_Chalo_Re&oldid=1249194214), [composed](https://en.wikipedia.org/w/index.php?title=Allerseelen_(Strauss)&oldid=1252214203), [recorded](https://en.wikipedia.org/w/index.php?title=Nobody_(1905_song)&oldid=1255091399), [premiere_date](https://en.wikipedia.org/w/index.php?title=Höstkväll&oldid=1213944779), ...
  * To be comprehensive, every page's infobox data will need to be parsed first
* Collect all relevant data and neatly arrange them in text files
* Manage the [**ugly**](https://en.wikipedia.org/w/index.php?title=Big_Joe_Mufferaw_(song)&oldid=1238351909), [**inconsistent**](https://en.wikipedia.org/w/index.php?title=After_All_(David_Bowie_song)&oldid=1225355888) and [**very ugly**](https://en.wikipedia.org/w/index.php?title=Everything_Is_(song)&oldid=1229964742) date formats and parse them to a more structured one
* Make a script for filtering the songs based on given birthdates
* Figure out how to order the songs (perhaps based on [pageview statistics](https://en.wikipedia.org/wiki/Wikipedia:Pageview_statistics))
