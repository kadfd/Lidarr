using FluentMigrator;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(17)]
    public class album_disambiguation : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            Alter.Table("Albums").AddColumn("Disambiguation").AsString().Nullable();
        }
    }
}
