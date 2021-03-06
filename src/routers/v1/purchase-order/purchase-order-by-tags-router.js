var Router = require('restify-router').Router;
var db = require("../../../db");
var PurchaseRequestManager = require("dl-module").managers.garmentPurchasing.PurchaseOrderManager;
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    var router = new Router();
    router.get("/", passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new PurchaseRequestManager(db, request.user);

            var keyword = request.query.filter.tag;
            var shipmentDate = request.query.filter.shipmentDate;
            var categoryId = request.query.filter.categoryId;

            manager.getPurchaseOrderByTag(categoryId, keyword, shipmentDate)
                .then(data => {
                    var result = resultFormatter.ok(apiVersion, 200, data);
                    response.send(200, result);
                })
                .catch(e => {
                    response.send(500, "gagal ambil data");
                });
        })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    });
    return router;
}

module.exports = getRouter;
