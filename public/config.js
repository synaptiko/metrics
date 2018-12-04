export default {
  title: 'Example Metrics',
  tables: [{
    title: 'Build time history',
    columns: [{
      title: 'Build ID',
      primaryKey: true
    }, {
      title: 'Timestamp',
      format: 'dateTime',
      source: 'project-name.build.timestamp'
    }, {
      title: 'Status',
      source: 'project-name.build.status'
    }, {
      source: /project-name\.time\..*/,
      title: /project-name\.time\.(.*)/,
      format: 'duration'
    }]
  }, {
    title: 'Artifact size history',
    columns: [{
      title: 'Build ID',
      primaryKey: true
    }, {
      title: 'Timestamp',
      format: 'dateTime',
      source: 'project-name.build.timestamp'
    }, {
      title: 'Status',
      source: 'project-name.build.status'
    }, {
      source: /project-name\.size\..*/,
      title: /project-name\.size\.(.*)/,
      format: 'fileSize'
    }]
  }]
}
