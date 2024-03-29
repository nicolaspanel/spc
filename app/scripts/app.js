'use strict';

angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  // 3rd party dependencies
  'btford.socket-io',
  'nvd3ChartDirectives',
  'vr.directives.slider'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  })
  .filter('capitalize', function() {
    return function(input, scope) {
      return input.substring(0,1).toUpperCase()+input.substring(1);
    };
  })
  .factory('d3Service', ['$document', '$window', '$q', '$rootScope',function($document, $window, $q, $rootScope) {
    var d = $q.defer();
    var d3service = {
      d3: function() { return d.promise; }
    };
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { d.resolve($window.d3); });
    }
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = '//cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState === 'complete') {
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);
    return d3service;
  }])
  .factory('socket', function (socketFactory) {
    return socketFactory();
  })
  .directive('ngRadialGauge', ['$window', '$timeout', 'd3Service', function ($window, $timeout, d3Service) {
    return {
      restrict: 'A',
      scope: {
        lowerLimit: '=',
        upperLimit: '=',
        ranges: '=',
        value: '=',
        valueUnit: '=',
        precision: '=',
        label: '@',
        onClick: '&'
      },
      link: function (scope, ele, attrs) {
        d3Service.d3().then(function (d3) {
          var renderTimeout;
          var width = parseInt(attrs.width) || 300;
          var innerRadius = Math.round((width * 130) / 300);
          var outterRadius = Math.round((width * 145) / 300);
          var majorGraduations = parseInt(attrs.majorGraduations - 1) || 5;
          var minorGraduations = parseInt(attrs.minorGraduations) || 10;
          var majorGraduationLenght = Math.round((width * 16) / 300);
          var minorGraduationLenght = Math.round((width * 10) / 300);
          var majorGraduationMarginTop = Math.round((width * 7) / 300);
          var majorGraduationColor = attrs.majorGraduationColor || '#B0B0B0';
          var minorGraduationColor = attrs.minorGraduationColor || '#D0D0D0';
          var majorGraduationTextColor = attrs.majorGraduationTextColor || '#6C6C6C';
          var needleColor = attrs.needleColor || '#416094';
          var valueVerticalOffset = Math.round((width * 30) / 300);
          var unactiveColor = '#D7D7D7';
          var majorGraduationTextSize = parseInt(attrs.majorGraduationTextSize);
          var needleValueTextSize = parseInt(attrs.needleValueTextSize);

          var svg = d3.select(ele[0])
                      .append('svg')
                      .attr('width', width)
                      .attr('height', width * 0.75);
          var renderMajorGraduations = function (majorGraduationsAngles) {
            var centerX = width / 2;
            var centerY = width / 2;
              //Render Major Graduations
            $.each(majorGraduationsAngles, function (index, value) {
              var cos1Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght));
              var sin1Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght));
              var cos2Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
              var sin2Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
              var x1 = centerX + cos1Adj;
              var y1 = centerY + sin1Adj * -1;
              var x2 = centerX + cos2Adj;
              var y2 = centerY + sin2Adj * -1;
              svg.append('svg:line')
                 .attr('x1', x1)
                 .attr('y1', y1)
                 .attr('x2', x2)
                 .attr('y2', y2)
                 .style('stroke', majorGraduationColor);

              renderMinorGraduations(majorGraduationsAngles, index);
            });
          };
          var renderMinorGraduations = function (majorGraduationsAngles, indexMajor) {
            var minorGraduationsAngles = [];
            if (indexMajor > 0) {
              var minScale = majorGraduationsAngles[indexMajor - 1];
              var maxScale = majorGraduationsAngles[indexMajor];
              var scaleRange = maxScale - minScale;
              for (var i = 1; i < minorGraduations; i++) {
                var scaleValue = minScale + i * scaleRange / minorGraduations;
                minorGraduationsAngles.push(scaleValue);
              }

              var centerX = width / 2;
              var centerY = width / 2;
              //Render Minor Graduations
              $.each(minorGraduationsAngles, function (indexMinor, value) {
                var cos1Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLenght));
                var sin1Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLenght));
                var cos2Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                var sin2Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                var x1 = centerX + cos1Adj;
                var y1 = centerY + sin1Adj * -1;
                var x2 = centerX + cos2Adj;
                var y2 = centerY + sin2Adj * -1;
                svg.append('svg:line')
                   .attr('x1', x1)
                   .attr('y1', y1)
                   .attr('x2', x2)
                   .attr('y2', y2)
                   .style('stroke', minorGraduationColor);
              });
            }
          };
          var getMajorGraduationValues = function (minLimit, maxLimit) {
            var scaleRange = maxLimit - minLimit;
            var majorGraduationValues = [];
            for (var i = 0; i <= majorGraduations; i++) {
              var scaleValue = minLimit + i * scaleRange / (majorGraduations);
              majorGraduationValues.push(scaleValue.toFixed(scope.precision));
            }

            return majorGraduationValues;
          };
          var getMajorGraduationAngles = function () {
            var scaleRange = 240;
            var minScale = -120;
            var graduationsAngles = [];
            for (var i = 0; i <= majorGraduations; i++) {
              var scaleValue = minScale + i * scaleRange / (majorGraduations);
              graduationsAngles.push(scaleValue);
            }

            return graduationsAngles;
          };
          var renderMajorGraduationTexts = function (majorGraduationsAngles, majorGraduationValues) {
            if (!scope.ranges) {
              return undefined;
            }

            var centerX = width / 2;
            var centerY = width / 2;
            var textVerticalPadding = 5;
            var textHorizontalPadding = 5;

            var lastGraduationValue = majorGraduationValues[majorGraduationValues.length - 1];
            var textSize = isNaN(majorGraduationTextSize) ? (width * 12) / 300 : majorGraduationTextSize;
            var fontStyle = textSize + 'px Courier';

            var dummyText = svg.append('text')
                               .attr('x', centerX)
                               .attr('y', centerY)
                               .attr('fill', 'transparent')
                               .attr('text-anchor', 'middle')
                               .style('font', fontStyle)
                               .text(lastGraduationValue + scope.valueUnit);

            var textWidth = dummyText.node().getBBox().width;

            for (var i = 0; i < majorGraduationsAngles.length; i++) {
              var angle = majorGraduationsAngles[i];
              var cos1Adj = Math.round(Math.cos((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght - textHorizontalPadding));
              var sin1Adj = Math.round(Math.sin((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght - textVerticalPadding));

              var sin1Factor = 1;
              if (sin1Adj < 0) {
                sin1Factor = 1.1;
              }
              if (sin1Adj > 0) {
                sin1Factor = 0.9;
              }
              if (cos1Adj > 0) {
                if (angle > 0 && angle < 45) {
                  cos1Adj -= textWidth / 2;
                }
                else {
                  cos1Adj -= textWidth;
                }
              }
              if (cos1Adj < 0) {
                if (angle < 0 && angle > -45) {
                  cos1Adj -= textWidth / 2;
                }
              }
              if (cos1Adj === 0) {
                cos1Adj -= angle === 0 ? textWidth / 4 : textWidth / 2;
              }

              var x1 = centerX + cos1Adj;
              var y1 = centerY + sin1Adj * sin1Factor * -1;

              svg.append('text')
                 .attr('class', 'mtt-majorGraduationText')
                 .style('font', fontStyle)
                 .attr('text-align', 'center')
                 .attr('x', x1)
                 .attr('dy', y1)
                 .attr('fill', majorGraduationTextColor)
                 .text(majorGraduationValues[i] + scope.valueUnit);
            }
          };
          var renderGraduationNeedle = function (minLimit, maxLimit) {
            var centerX = width / 2;
            var centerY = width / 2;
            var centerColor;

            if (typeof scope.value === 'undefined') {
              centerColor = unactiveColor;
            }
            else {
              centerColor = needleColor;
              var needleValue = ((scope.value - minLimit) * 240 / (maxLimit - minLimit)) - 30;
              var thetaRad = needleValue * Math.PI / 180;

              var needleLen = innerRadius - majorGraduationLenght - majorGraduationMarginTop;
              var needleRadius = (width * 2.5) / 300;
              var topX = centerX - needleLen * Math.cos(thetaRad);
              var topY = centerY - needleLen * Math.sin(thetaRad);
              var leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
              var leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);
              var rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
              var rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);
              var triangle = 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
              var textSize = isNaN(needleValueTextSize) ? (width * 12) / 300 : needleValueTextSize;
              var fontStyle = textSize + 'px Courier';

              if (scope.value >= minLimit && scope.value <= maxLimit) {
                svg.append('svg:path')
                   .attr('d', triangle)
                   .style('stroke-width', 1)
                   .style('stroke', needleColor)
                   .style('fill', needleColor);
              }

              svg.append('text')
                 .attr('x', centerX)
                 .attr('y', centerY + valueVerticalOffset)
                 .attr('class', 'mtt-graduationValueText')
                 .attr('fill', needleColor)
                 .attr('text-anchor', 'middle')
                 .attr('font-weight', 'bold')
                 .style('font', fontStyle)
                 .text('[ ' + scope.value.toFixed(scope.precision) + scope.valueUnit + ' ]');
            }

            var circleRadius = (width * 6) / 300;

            svg.append('circle')
               .attr('r', circleRadius)
               .attr('cy', centerX)
               .attr('cx', centerY)
               .attr('fill', centerColor);
          };
          $window.onresize = function () {
            scope.$apply();
          };
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render();
          });
          scope.$watch('ranges', function () {
            scope.render();
          }, true);
          scope.$watch('value', function () {
            scope.render();
          }, true);
          scope.render = function () {
            svg.selectAll('*').remove();

            if (renderTimeout) {
              clearTimeout(renderTimeout);
            }

            renderTimeout = $timeout(function () {
              var maxLimit = scope.upperLimit ? scope.upperLimit : 100;
              var minLimit = scope.lowerLimit ? scope.lowerLimit : 0;
              var d3DataSource = [];

              if (typeof scope.ranges === 'undefined') {
                d3DataSource.push([minLimit, maxLimit, unactiveColor]);
              }
              else {
                //Data Generation
                $.each(scope.ranges, function (index, value) {
                  d3DataSource.push([value.min, value.max, value.color]);
                });
              }

              //Render Gauge Color Area
              var translate = 'translate(' + width / 2 + ',' + width / 2 + ')';
              var cScale = d3.scale.linear().domain([minLimit, maxLimit]).range([-120 * (Math.PI / 180), 120 * (Math.PI / 180)]);
              var arc = d3.svg.arc()
                          .innerRadius(innerRadius)
                          .outerRadius(outterRadius)
                          .startAngle(function (d) { return cScale(d[0]); })
                          .endAngle(function (d) { return cScale(d[1]); });
              svg.selectAll('path')
                 .data(d3DataSource)
                 .enter()
                 .append('path')
                 .attr('d', arc)
                 .style('fill', function (d) { return d[2]; })
                 .attr('transform', translate);

              var majorGraduationsAngles = getMajorGraduationAngles();
              var majorGraduationValues = getMajorGraduationValues(minLimit, maxLimit);
              renderMajorGraduations(majorGraduationsAngles);
              renderMajorGraduationTexts(majorGraduationsAngles, majorGraduationValues);
              renderGraduationNeedle(minLimit, maxLimit);
            }, 200);
          };
        });
      }
    };
  }])
  .directive('smoothieChart', [function(){
    return {
      restrict: 'A',
      scope: {
        // Bindings
        data: '=',
        // attributes
        min: '@',
        max: '@'
      },
      link: function(scope, element, attrs){
        // Scope vars
        var data;
        scope.canvas = element[0];
        scope.container = angular.element(scope.canvas).parent();
        scope.canvas.width = scope.container.width();
        var options = {grid:{fillStyle:'#ffffff'},labels:{fillStyle:'#000000'}};
        //scope.counter = 0;
        // setInterval(function(){
        //   scope.counter++;
        // },1000);
        // scope.$watch('counter', function(newValue, oldValue){
        //   scope.canvas.width = scope.container.width();
        // }, true);
        
        // Check attributes
        if (angular.isDefined(attrs.min)) {
          options.minValue = attrs.min;
        }
        if (angular.isDefined(attrs.max)) {
          options.maxValue = attrs.max;
        }

        // Check Scope
        if (angular.isDefined(scope.data)) {
          data = scope.data;
        }
        
        var smoothie = new SmoothieChart(options);
        smoothie.streamTo(scope.canvas, 200);
        if (data instanceof Array){
          data.forEach(function(entry){
            smoothie.addTimeSeries(entry, {lineWidth:2,strokeStyle:'#000000'});
          });
        }else{
          smoothie.addTimeSeries(data, {lineWidth:2,strokeStyle:'#000000'});
        }
      }
    };
  }]);