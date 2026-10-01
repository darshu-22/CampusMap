/* ==========================================================================
   CampusNav 360° - Main Application Engine
   ========================================================================== */

(function () {
  'use strict';

  // --- State Variables ---
  let selectedFromId = 'maingate.jpeg';
  let selectedToId = 'adminblock.jpeg';
  let activeRoutePath = []; // Array of node IDs representing shortest path
  let currentStepIndex = 0; // Current step along active route path
  let modalTarget = 'FROM'; // 'FROM' or 'TO' when modal opens
  let activeCategoryFilter = 'ALL';

  // --- Three.js 360 Panorama Viewer Variables ---
  let scene, camera, renderer, controls;
  let sphereMesh, textureLoader;
  let hotspotSprites = [];

  // --- DOM Elements ---
  const btnFromPicker = document.getElementById('btn-from-picker');
  const btnToPicker = document.getElementById('btn-to-picker');
  const fromBtnThumb = document.getElementById('from-btn-thumb');
  const fromBtnName = document.getElementById('from-btn-name');
  const fromBtnCat = document.getElementById('from-btn-cat');
  const toBtnThumb = document.getElementById('to-btn-thumb');
  const toBtnName = document.getElementById('to-btn-name');
  const toBtnCat = document.getElementById('to-btn-cat');
  const btnSwap = document.getElementById('btn-swap-locations');
  const btnLocate = document.getElementById('btn-locate-path');

  const fromCardImg = document.getElementById('from-card-img');
  const fromCardTitle = document.getElementById('from-card-title');
  const fromCardSubtext = document.getElementById('from-card-subtext');
  const toCardImg = document.getElementById('to-card-img');
  const toCardTitle = document.getElementById('to-card-title');
  const toCardSubtext = document.getElementById('to-card-subtext');

  const metricStopsCount = document.getElementById('metric-stops-count');
  const metricEstTime = document.getElementById('metric-est-time');
  const hudStepCount = document.getElementById('hud-step-count');
  const hudStepTitle = document.getElementById('hud-step-title');
  const bannerNextTarget = document.getElementById('banner-next-target');
  const directionBanner = document.getElementById('direction-banner');

  const stepsRibbonContainer = document.getElementById('steps-ribbon-container');
  const btnPrevStep = document.getElementById('btn-prev-step');
  const btnNextStep = document.getElementById('btn-next-step');

  const locationModal = document.getElementById('location-modal');
  const modalHeading = document.getElementById('modal-heading');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalSearchInput = document.getElementById('modal-search-input');
  const modalCatPills = document.getElementById('modal-cat-pills');
  const modalLocationsGrid = document.getElementById('modal-locations-grid');

  const hudResetCam = document.getElementById('hud-reset-cam');
  const hudFullscreen = document.getElementById('hud-fullscreen');

  // ==========================================================================
  // 1. GRAPH SHORT-PATH ALGORITHM (BFS)
  // ==========================================================================
  function findShortestPath(startId, goalId) {
    if (startId === goalId) return [startId];

    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const currId = path[path.length - 1];

      if (currId === goalId) {
        return path;
      }

      const currNode = CAMPUS_NODES[currId];
      if (currNode && currNode.hotspots) {
        for (const hs of currNode.hotspots) {
          const targetId = hs.target;
          if (targetId && !visited.has(targetId) && CAMPUS_NODES[targetId]) {
            visited.add(targetId);
            queue.push([...path, targetId]);
          }
        }
      }
    }

    return [startId, goalId]; // Fallback if unreachable
  }

  // ==========================================================================
  // 2. INITIALIZATION & EVEN LISTENERS
  // ==========================================================================
  function initApp() {
    initThreeJSViewer();
    setupEventListeners();

    // Default route: Main Gate -> Admin Block
    calculateAndRenderRoute('maingate.jpeg', 'adminblock.jpeg');
  }

  function setupEventListeners() {
    // Modal openers
    btnFromPicker.addEventListener('click', () => openLocationModal('FROM'));
    btnToPicker.addEventListener('click', () => openLocationModal('TO'));
    btnCloseModal.addEventListener('click', closeLocationModal);

    // Swap From/To locations
    btnSwap.addEventListener('click', () => {
      const temp = selectedFromId;
      selectedFromId = selectedToId;
      selectedToId = temp;
      updatePickerButtonsUI();
      calculateAndRenderRoute(selectedFromId, selectedToId);
    });

    // Locate CTA
    btnLocate.addEventListener('click', () => {
      calculateAndRenderRoute(selectedFromId, selectedToId);
    });

    // Step Controls
    btnPrevStep.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        goToStep(currentStepIndex - 1);
      }
    });

    btnNextStep.addEventListener('click', () => {
      if (currentStepIndex < activeRoutePath.length - 1) {
        goToStep(currentStepIndex + 1);
      }
    });

    // HUD Actions
    hudResetCam.addEventListener('click', resetCameraAngle);
    hudFullscreen.addEventListener('click', toggleFullscreen);

    // Search and Filters
    modalSearchInput.addEventListener('input', renderModalGrid);
    modalCatPills.addEventListener('click', (e) => {
      if (e.target.classList.contains('cat-pill')) {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        activeCategoryFilter = e.target.getAttribute('data-category');
        renderModalGrid();
      }
    });

    // Close modal on outside click
    locationModal.addEventListener('click', (e) => {
      if (e.target === locationModal) closeLocationModal();
    });
  }

  // ==========================================================================
  // 3. ROUTE CALCULATION & UI UPDATES
  // ==========================================================================
  function calculateAndRenderRoute(fromId, toId) {
    selectedFromId = fromId;
    selectedToId = toId;

    // 1. Update Top Picker Buttons
    updatePickerButtonsUI();

    // 2. Update Side-by-Side Image Cards
    updateImageCardsUI();

    // 3. Compute Shortest Path
    activeRoutePath = findShortestPath(fromId, toId);
    currentStepIndex = 0;

    // 4. Update Metrics Summary
    const stops = activeRoutePath.length;
    metricStopsCount.textContent = stops;
    metricEstTime.textContent = `~${Math.max(1, Math.ceil(stops * 0.5))} mins`;

    // 5. Render Waypoint Ribbon Timeline
    renderStepsRibbon();

    // 6. Load First Step in 360 Viewer
    goToStep(0);
  }

  function updatePickerButtonsUI() {
    const fromNode = CAMPUS_NODES[selectedFromId];
    const toNode = CAMPUS_NODES[selectedToId];

    if (fromNode) {
      fromBtnThumb.src = fromNode.image;
      fromBtnName.textContent = fromNode.name;
      fromBtnCat.textContent = fromNode.category;
    }

    if (toNode) {
      toBtnThumb.src = toNode.image;
      toBtnName.textContent = toNode.name;
      toBtnCat.textContent = toNode.category;
    }
  }

  function updateImageCardsUI() {
    const fromNode = CAMPUS_NODES[selectedFromId];
    const toNode = CAMPUS_NODES[selectedToId];

    if (fromNode) {
      fromCardImg.src = fromNode.image;
      fromCardTitle.textContent = fromNode.name;
      fromCardSubtext.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${fromNode.category}`;
    }

    if (toNode) {
      toCardImg.src = toNode.image;
      toCardTitle.textContent = toNode.name;
      toCardSubtext.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> ${toNode.category}`;
    }
  }

  function renderStepsRibbon() {
    stepsRibbonContainer.innerHTML = '';

    activeRoutePath.forEach((nodeId, idx) => {
      const node = CAMPUS_NODES[nodeId];
      if (!node) return;

      const stepElem = document.createElement('div');
      stepElem.className = `step-node-item ${idx === currentStepIndex ? 'active' : ''}`;
      stepElem.innerHTML = `
        <div class="step-node-num">${idx + 1}</div>
        <div class="step-node-title">${node.name}</div>
      `;

      stepElem.addEventListener('click', () => goToStep(idx));
      stepsRibbonContainer.appendChild(stepElem);

      if (idx < activeRoutePath.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'step-arrow-connector';
        arrow.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        stepsRibbonContainer.appendChild(arrow);
      }
    });
  }

  function goToStep(index) {
    if (index < 0 || index >= activeRoutePath.length) return;
    currentStepIndex = index;

    const currNodeId = activeRoutePath[currentStepIndex];
    const currNode = CAMPUS_NODES[currNodeId];

    if (!currNode) return;

    // Update Step HUD
    hudStepCount.textContent = `Step ${currentStepIndex + 1} of ${activeRoutePath.length}`;
    hudStepTitle.textContent = currNode.name;

    // Update Nav Buttons
    btnPrevStep.disabled = currentStepIndex === 0;
    btnNextStep.disabled = currentStepIndex === activeRoutePath.length - 1;

    // Update Active Step in Ribbon
    document.querySelectorAll('.step-node-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === currentStepIndex);
    });

    // Update Direction Banner for Next Target
    if (currentStepIndex < activeRoutePath.length - 1) {
      const nextNodeId = activeRoutePath[currentStepIndex + 1];
      const nextNode = CAMPUS_NODES[nextNodeId];
      bannerNextTarget.textContent = nextNode ? nextNode.name : 'Next Location';
      directionBanner.style.display = 'flex';
    } else {
      bannerNextTarget.textContent = 'Destination Reached!';
      directionBanner.style.display = 'flex';
    }

    // Load Panorama Image into Three.js
    loadPanoramaTexture(currNode.image, () => {
      // Find hotspot pointing to next step if exists
      if (currentStepIndex < activeRoutePath.length - 1) {
        const nextNodeId = activeRoutePath[currentStepIndex + 1];
        const hotspot = currNode.hotspots.find(h => h.target === nextNodeId);
        if (hotspot && hotspot.position) {
          orientCameraToPosition(hotspot.position);
        }
      }
    });

    // Render Hotspots for current node
    render3DHotspots(currNode);
  }

  // ==========================================================================
  // 4. THREE.JS 360° PANORAMA RENDERER
  // ==========================================================================
  function initThreeJSViewer() {
    const container = document.getElementById('panorama-container');
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = -0.3; // Natural sphere rotation
    controls.minDistance = 1;
    controls.maxDistance = 100;

    // 360 Sphere Geometry (Inverted Normals)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0x111827 });
    sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    textureLoader = new THREE.TextureLoader();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    animateThreeJS();
  }

  function loadPanoramaTexture(imagePath, callback) {
    textureLoader.load(
      imagePath,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        sphereMesh.material.map = texture;
        sphereMesh.material.needsUpdate = true;
        if (callback) callback();
      },
      undefined,
      (err) => {
        console.error('Error loading panorama texture:', err);
      }
    );
  }

  function render3DHotspots(node) {
    // Clear existing hotspots
    hotspotSprites.forEach(sprite => scene.remove(sprite));
    hotspotSprites = [];

    if (!node || !node.hotspots) return;

    const nextNodeId = currentStepIndex < activeRoutePath.length - 1 ? activeRoutePath[currentStepIndex + 1] : null;

    node.hotspots.forEach(hs => {
      const isRouteNext = hs.target === nextNodeId;

      // Create Canvas Sprite for Hotspot Marker
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      // Draw Glowing Circle / Arrow
      ctx.beginPath();
      ctx.arc(64, 64, 48, 0, 2 * Math.PI);
      ctx.fillStyle = isRouteNext ? 'rgba(6, 182, 212, 0.9)' : 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = isRouteNext ? '#ffffff' : 'rgba(0, 0, 0, 0.5)';
      ctx.stroke();

      // Inner icon arrow
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('➔', 64, 64);

      const spriteMap = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        depthTest: false
      });

      const sprite = new THREE.Sprite(spriteMaterial);
      const scale = isRouteNext ? 50 : 35;
      sprite.scale.set(scale, scale, 1);

      if (hs.position && hs.position.length === 3) {
        sprite.position.set(hs.position[0], hs.position[1], hs.position[2]);
      } else {
        sprite.position.set(0, -100, -300);
      }

      sprite.userData = { target: hs.target, title: hs.title };
      scene.add(sprite);
      hotspotSprites.push(sprite);
    });
  }

  function orientCameraToPosition(pos) {
    if (!pos || pos.length < 3) return;
    const targetVec = new THREE.Vector3(pos[0], pos[1], pos[2]);
    controls.target.copy(targetVec.clone().normalize().multiplyScalar(10));
    controls.update();
  }

  function resetCameraAngle() {
    controls.reset();
  }

  function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);
    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const container = document.getElementById('panorama-container');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function toggleFullscreen() {
    const container = document.querySelector('.panorama-viewport-wrapper');
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  }

  // ==========================================================================
  // 5. LOCATION SELECTOR MODAL
  // ==========================================================================
  function openLocationModal(targetType) {
    modalTarget = targetType;
    modalHeading.textContent = targetType === 'FROM' ? 'Select Starting Location (From)' : 'Select Destination Location (To)';
    modalSearchInput.value = '';
    activeCategoryFilter = 'ALL';
    
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.cat-pill[data-category="ALL"]').classList.add('active');

    renderModalGrid();
    locationModal.classList.add('active');
  }

  function closeLocationModal() {
    locationModal.classList.remove('active');
  }

  function renderModalGrid() {
    modalLocationsGrid.innerHTML = '';
    const query = modalSearchInput.value.toLowerCase().trim();

    Object.values(CAMPUS_NODES).forEach(node => {
      const matchSearch = node.name.toLowerCase().includes(query) || node.category.toLowerCase().includes(query);
      const matchCat = activeCategoryFilter === 'ALL' || node.category === activeCategoryFilter;

      if (matchSearch && matchCat) {
        const itemCard = document.createElement('div');
        itemCard.className = 'location-grid-item';
        itemCard.innerHTML = `
          <div class="grid-thumb-wrapper">
            <img src="${node.image}" class="grid-thumb-img" alt="${node.name}" loading="lazy" />
          </div>
          <div class="grid-item-info">
            <div class="grid-item-name">${node.name}</div>
            <div class="grid-item-category">${node.category}</div>
          </div>
        `;

        itemCard.addEventListener('click', () => {
          if (modalTarget === 'FROM') {
            selectedFromId = node.id;
          } else {
            selectedToId = node.id;
          }
          closeLocationModal();
          calculateAndRenderRoute(selectedFromId, selectedToId);
        });

        modalLocationsGrid.appendChild(itemCard);
      }
    });
  }

  // Run App when DOM ready
  document.addEventListener('DOMContentLoaded', initApp);

})();
