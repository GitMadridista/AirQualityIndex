var HospitalMarker = null;
function initIcons() {
HospitalMarker= class HospitalMarker extends google.maps.OverlayView {
    constructor(params) {
      super();
      this.position = params.position;
      this.value = params.value;

      const content = document.createElement('i');
      content.classList.add('marker');
      content.classList.add('hosp-marker');
      content.classList.add('fas');
      content.classList.add('fa-medkit');
      content.id = 'hospSymbol';
    //   content.textContent = params.label;
      content.style.color = 'white';
      content.style.display = 'none';
      content.style.position = 'absolute';
      content.style.transform = 'translate(-50%, -100%)';
      content.style.backgroundColor = '#ff284a';

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.cursor = 'pointer';
      container.setAttribute('data-toggle', 'tooltip');
      container.setAttribute('title', params.label);
      container.appendChild(content);

      this.container = container;

    //   document.addEventListener('click',function(e){
    //     if(e.target && e.target.id== 'hospSymbol'){
    //          alert("jdsjhfjs");
    //      }
    //  });
    }

    onAdd() {
      this.getPanes().floatPane.appendChild(this.container);
    }

    onRemove() {
      this.container.remove();
    }

    draw() {
      const pos = this.getProjection().fromLatLngToDivPixel(this.position);
      this.container.style.left = pos.x + 'px';
      this.container.style.top = pos.y + 'px';
    }
  }
}


