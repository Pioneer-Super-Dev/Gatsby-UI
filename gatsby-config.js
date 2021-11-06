module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "GatabyProject",
  },
  plugins: [
    "gatsby-plugin-sass", 
    "gatsby-plugin-gatsby-cloud",
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'GRAPHCMS',
        fieldName: 'graphCmsData',
        url: 'https://api-us-east-1.graphcms.com/v2/ckso8s3um1hfq01y25hh4h6ri/master',
      }
    }
  ],
  
};
