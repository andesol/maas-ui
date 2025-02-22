/* Copyright 2015-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS Script Result Controller
 */
import angular from "angular";

/* @ngInject */
function NodeResultController(
  $scope,
  $rootScope,
  $stateParams,
  $location,
  ControllersManager,
  NodeResultsManagerFactory,
  ManagerHelperService,
  ErrorService,
  GeneralManager
) {
  // Set the title and page.
  $rootScope.title = "Loading...";

  // Initial values.
  $scope.loaded = false;
  $scope.resultLoaded = false;
  $scope.node = null;
  $scope.output = "combined";
  $scope.result = null;
  $scope.nodesManager = ControllersManager;
  $scope.type_name = "controller";
  $rootScope.page = "controllers";

  $scope.get_result_data = function (output) {
    $scope.output = output;
    $scope.data = "Loading...";
    var nodeResultsManager = NodeResultsManagerFactory.getManager($scope.node);
    nodeResultsManager
      .get_result_data($scope.result.id, $scope.output)
      .then(function (data) {
        if (data === "") {
          $scope.data = "Empty file.";
        } else {
          $scope.data = data;
        }
      });
  };

  // Called once the node is loaded.
  function nodeLoaded(node) {
    $scope.node = node;
    $scope.loaded = true;

    // Get the NodeResultsManager and load it.
    var nodeResultsManager = NodeResultsManagerFactory.getManager($scope.node);
    var requestedResult = parseInt($stateParams.id, 10);
    nodeResultsManager.getItem(requestedResult).then(function (result) {
      $scope.result = result;
      $scope.get_result_data($scope.output);
      $scope.resultLoaded = true;
      $rootScope.title = $scope.node.fqdn + " - " + $scope.result.name;
    });
  }

  // Update the title when the fqdn of the node changes.
  $scope.$watch("node.fqdn", function () {
    if (angular.isObject($scope.node) && angular.isObject($scope.result)) {
      $rootScope.title = $scope.node.fqdn + " - " + $scope.result.name;
    }
  });

  // Load nodes manager.
  ManagerHelperService.loadManager($scope, $scope.nodesManager).then(
    function () {
      // If redirected from the NodeDetailsController then the node
      // will already be active. No need to set it active again.
      var activeNode = $scope.nodesManager.getActiveItem();
      if (
        angular.isObject(activeNode) &&
        activeNode.system_id === $stateParams.system_id
      ) {
        nodeLoaded(activeNode);
      } else {
        $scope.nodesManager.setActiveItem($stateParams.system_id).then(
          function (node) {
            nodeLoaded(node);
          },
          function (error) {
            ErrorService.raiseError(error);
          }
        );
      }
    }
  );

  // Destroy the NodeResultsManager when the scope is destroyed. This is
  // so the client will not recieve any more notifications about results
  // from this node.
  $scope.$on("$destroy", function () {
    var nodeResultsManager = NodeResultsManagerFactory.getManager($scope.node);
    if (angular.isObject(nodeResultsManager)) {
      nodeResultsManager.destroy();
    }
  });
}

export default NodeResultController;
