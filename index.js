/* jshint node: true */
'use strict'
const path = require('path')
const mergeTrees = require('broccoli-merge-trees')
const Funnel = require('broccoli-funnel')
const neededJsFiles = ['pdf.js', 'pdf.worker.js']

module.exports = {
  name: 'ember-pdf-js',
  included (app, parentAddon) {
    this._super.included(...arguments)
    while (app.app) {
      app = app.app
    }
    let target = parentAddon || app
    target.import(`${target.bowerDirectory}/pdfjs-dist/build/pdf.js`)
    target.import(`${target.bowerDirectory}/pdfjs-dist/build/pdf.worker.js`)
    target.import(`${target.bowerDirectory}/pdfjs-dist/web/pdf_viewer.js`)
    target.import(`${target.bowerDirectory}/pdfjs-dist/web/pdf_viewer.css`)
  },

  treeForPublic (tree) {
    let workerPath = path.join(this.project.root, 'bower_components', 'pdfjs-dist', 'build')
    let pdfJsImages = path.join(this.project.root, 'bower_components', 'pdfjs-dist', 'web', 'images')
    let pdfJsImagesTree = new Funnel(this.treeGenerator(pdfJsImages), {
      destDir: '/assets/images'
    })
    let pdfJsFilesTree = new Funnel(workerPath, {
      include: neededJsFiles,
      destDir: '/'
    })
    if (tree) {
      return mergeTrees([
        tree,
        pdfJsFilesTree,
        pdfJsImagesTree
      ])
    } else {
      return mergeTrees([
        pdfJsFilesTree,
        pdfJsImagesTree
      ])
    }
  }
}
