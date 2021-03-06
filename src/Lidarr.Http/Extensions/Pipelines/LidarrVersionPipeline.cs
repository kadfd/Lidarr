using System;
using Nancy;
using Nancy.Bootstrapper;
using NzbDrone.Common.EnvironmentInfo;

namespace Lidarr.Http.Extensions.Pipelines
{
    public class LidarrVersionPipeline : IRegisterNancyPipeline
    {
        public int Order => 0;

        public void Register(IPipelines pipelines)
        {
            pipelines.AfterRequest.AddItemToStartOfPipeline((Action<NancyContext>) Handle);
        }

        private void Handle(NancyContext context)
        {
            if (!context.Response.Headers.ContainsKey("X-ApplicationVersion"))
            {
                context.Response.Headers.Add("X-ApplicationVersion", BuildInfo.Version.ToString());
            }
        }
    }
}
