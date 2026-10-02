/* =============================================
   Resume data — the single source of truth.
   The experience timeline, the one-page resume,
   and the SQL console are all built from this file.
   ============================================= */

const RESUME = {
  name: 'Teerajate Vantanasiri',
  title: 'Data Engineer',
  location: 'Los Angeles, CA',
  email: 'vantanasiri.t@gmail.com',
  github: 'https://github.com/Teerajate2',
  linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle' — the link appears once this is filled in

  summary:
    'Data Engineer with 6 years working with data, including 3 years at The Walt Disney Company ' +
    'building the data models, validation and data products behind Studio box office forecasting. ' +
    'Strong in SQL, Python/PySpark, ETL and data modeling, with production experience serving executives ' +
    'through dashboards and apps. Builds AI agents to automate pipeline testing, validation and documentation.',

  skills: [
    { category: 'Languages', items: ['SQL', 'Python', 'R'] },
    { category: 'ETL & Data Modeling', items: ['PySpark', 'dbt', 'Airflow', 'Databricks Asset Bundles', 'Dimensional modeling', '3NF schema design'] },
    { category: 'Data Quality & Governance', items: ['Validation checks', 'Unity Catalog', 'Data lineage'] },
    { category: 'Platforms', items: ['Databricks', 'Snowflake', 'AWS (S3, Redshift, RDS)', 'BigQuery', 'PostgreSQL', 'MySQL', 'Hive'] },
    { category: 'AI & ML', items: ['AI agents', 'MLflow', 'TensorFlow'] },
    { category: 'Visualization & Data Products', items: ['Tableau', 'Power BI', 'Sisense', 'Streamlit'] },
    { category: 'DevOps', items: ['CI/CD', 'Python wheels', 'Docker', 'Git'] },
  ],

  // `tags` drive the skill filter on the timeline and the SQL console's highlight_skills table.
  experience: [
    {
      company: 'The Walt Disney Company',
      role: 'Data Engineer',
      location: 'Los Angeles, CA',
      start: '2023-09',
      end: null,
      highlights: [
        { text: 'Designed and own the data models behind Studio box office forecasting, transforming 13 social media source tables (1M+ rows each) into a 1M-row canonical dataset with PySpark on Databricks.', tags: ['PySpark', 'Databricks', 'Data modeling'] },
        { text: 'Built data quality checks for nulls, duplicates, negative values and inconsistent records, so forecast models and executive reporting only receive validated data.', tags: ['Data quality', 'PySpark'] },
        { text: 'Orchestrate daily production jobs and task dependencies with Databricks Asset Bundles, deployed through CI/CD across dev, staging and prod.', tags: ['Databricks', 'Orchestration', 'CI/CD'] },
        { text: 'Turned forecast outputs into a Streamlit data product that Studio Marketing executives use to make release and campaign decisions.', tags: ['Streamlit', 'Python'] },
        { text: 'Built AI agents that automate pipeline testing, data validation, documentation and dashboard design, cutting manual QA and documentation work for the team.', tags: ['AI agents', 'Data quality'] },
        { text: 'Packaged pipeline logic as Python wheels deployed through CI/CD, improving query performance by 40%.', tags: ['Python', 'CI/CD'] },
        { text: 'Migrated 200+ tables from Hive Metastore to Unity Catalog, strengthening access control, lineage and data governance.', tags: ['Unity Catalog', 'Databricks', 'Governance'] },
        { text: 'Integrated MLflow model logging so data scientists can track experiments and promote models reliably.', tags: ['MLflow'] },
      ],
    },
    {
      company: 'Veolia North America',
      role: 'Business Intelligence Analyst Intern',
      location: 'Boston, MA',
      start: '2022-06',
      end: '2023-01',
      highlights: [
        { text: 'Built data models in MySQL and Sisense dashboards on AWS Redshift data, giving HR leaders visibility into key workforce metrics.', tags: ['SQL', 'Data modeling', 'AWS', 'BI dashboards'] },
        { text: 'Designed ETL workflows that combined multiple source systems into one reporting layer.', tags: ['ETL', 'SQL'] },
        { text: 'Standardized metric definitions across reports with business stakeholders, improving reporting efficiency by 18%.', tags: ['Governance', 'BI dashboards'] },
      ],
    },
    {
      company: 'Econ Warehouse (ThaiBev subsidiary)',
      role: 'Data Integration Analyst',
      location: 'Bangkok, Thailand',
      start: '2019-01',
      end: '2021-08',
      highlights: [
        { text: 'Integrated marketing data with Google Analytics and SEO tracking to measure the funnel, contributing to a 22% lift in conversion rate.', tags: ['ETL', 'SQL'] },
        { text: 'Combined ERP and logistics data to guide expansion into e-commerce channels, which drove 20% YoY sales growth.', tags: ['ETL', 'SQL'] },
        { text: 'Analyzed inventory and merchandising data in Tableau, supporting a 25% cost reduction in retail operations.', tags: ['BI dashboards'] },
        { text: 'Built ARIMA forecasts with Box-Cox transforms to reduce forecast error for revenue planning.', tags: ['Forecasting'] },
      ],
    },
  ],



  education: [
    { school: 'Chulalongkorn University', place: 'Bangkok, Thailand', degree: 'B.E. Information Engineering', start: '2013-06', end: '2018-01' },
  ],
};
