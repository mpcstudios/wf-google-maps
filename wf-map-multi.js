(function () {
  'use strict';

  window.initWebflowMapMulti = function (config) {
    config = config || {};

    var containerId = config.containerId || 'map-frame';
    var container = document.getElementById(containerId);

    if (!container) {
      console.warn('[wf-map-multi] No element found with id "' + containerId + '". Map not rendered.');
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error('[wf-map-multi] Google Maps API not loaded.');
      return;
    }

    if (!config.mapId) {
      console.warn('[wf-map-multi] No mapId provided. Advanced Markers require a Map ID.');
    }

    var selector = config.locationsSelector || '[data-map-location]';
    var nodes = document.querySelectorAll(selector);
    var locations = [];

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var lat = parseFloat(el.getAttribute('data-lat'));
      var lng = parseFloat(el.getAttribute('data-lng'));
      if (isNaN(lat) || isNaN(lng)) continue;

      var markerIcon = el.getAttribute('data-marker') || '';
      if (!markerIcon) {
        var markerImg = el.querySelector('img[data-marker-img], img.wf-marker-img, img');
        if (markerImg && markerImg.src) {
          markerIcon = markerImg.src;
        }
      }

      locations.push({
        lat: lat,
        lng: lng,
        title: el.getAttribute('data-name') || el.getAttribute('data-title') || '',
        address: el.getAttribute('data-address') || '',
        phone: el.getAttribute('data-phone') || '',
        markerIcon: markerIcon
      });
    }

    if (locations.length === 0) {
      console.warn('[wf-map-multi] No valid location elements found matching selector "' + selector + '".');
    }

    var defaultCenter = config.center || (locations[0]
      ? { lat: locations[0].lat, lng: locations[0].lng }
      : { lat: 0, lng: 0 });

    var map = new google.maps.Map(container, {
      center: defaultCenter,
      zoom: config.zoom || 12,
      mapId: config.mapId || undefined,
      gestureHandling: 'cooperative'
    });

    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var markerWidth = config.markerWidth || 40;
    var hasAdvanced = !!(google.maps.marker && google.maps.marker.AdvancedMarkerElement);

    locations.forEach(function (loc) {
      var position = { lat: loc.lat, lng: loc.lng };
      var marker;

      if (hasAdvanced) {
        var markerOptions = {
          map: map,
          position: position,
          title: loc.title
        };

        if (loc.markerIcon) {
          var iconImg = document.createElement('img');
          iconImg.src = loc.markerIcon;
          iconImg.alt = loc.title || 'Map marker';
          iconImg.style.width = markerWidth + 'px';
          iconImg.style.height = 'auto';
          markerOptions.content = iconImg;
        }

        marker = new google.maps.marker.AdvancedMarkerElement(markerOptions);

        marker.addListener('click', function () {
          infoWindow.setContent(buildInfoWindowContent(loc));
          infoWindow.open({ anchor: marker, map: map });
        });
      } else {
        marker = new google.maps.Marker({
          map: map,
          position: position,
          title: loc.title,
          icon: loc.markerIcon || undefined
        });

        marker.addListener('click', function () {
          infoWindow.setContent(buildInfoWindowContent(loc));
          infoWindow.open(map, marker);
        });
      }

      bounds.extend(position);
    });

    if (locations.length > 1 && config.fitBounds !== false) {
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } else if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(config.zoom || 14);
    }

    window._wfMapMulti = map;
  };

  function buildInfoWindowContent(loc) {
    var parts = [];

    if (loc.title) {
      parts.push('<div style="font-weight:600;font-size:15px;margin-bottom:4px;">' + escapeHtml(loc.title) + '</div>');
    }
    if (loc.address) {
      var encoded = encodeURIComponent(loc.address);
      parts.push('<div style="font-size:13px;margin-bottom:4px;"><a href="https://www.google.com/maps/dir/?api=1&destination=' + encoded + '" target="_blank" rel="noopener" style="color:#1a73e8;text-decoration:none;">' + escapeHtml(loc.address) + '</a></div>');
    }
    if (loc.phone) {
      var telHref = loc.phone.replace(/[^0-9+]/g, '');
      parts.push('<div style="font-size:13px;"><a href="tel:' + telHref + '" style="color:#1a73e8;text-decoration:none;">' + escapeHtml(loc.phone) + '</a></div>');
    }

    return '<div style="font-family:inherit;padding:4px 6px;max-width:240px;">' + parts.join('') + '</div>';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
