const AUTHTOKENURI = 'https://www.aqi.in/checklocationaccess';

const CAUTIION_PATIENTS = {
    GOOD: 'Air quality is excellent and poses little or no risk to patients. No special precaution is needed',
    MODERATE: 'Air quality is acceptable; however, there may be some health concern for a small number of unusually sensitive individuals. We cannot identify groups of people that are at greater risk when air quality is in this range. However, controlled human exposure studies indicate that there are individuals who experience health effects at more moderate levels of outdoor exertion or at lower ozone levels than the average person, and these individuals may experience effects when air quality is in the moderate range.',
    POOR: 'When air quality is in this range, people that are included in a sensitive group, whether the sensitivity is due to medical conditions, exposure conditions, or inherent susceptibility, may experience the effects described above when engaged in outdoor activities. However, exposures to ambient concentrations in this range are not likely to result in effects in the general population. For ozone, the sensitive group includes children; people with lung diseases, such as asthma, chronic bronchitis, and emphysema; older adults',
    UNHEALTHY: 'When air quality is in this range, any patient may experience the respiratory effects. Members of sensitive groups are likely to experience more severe effects. EPA\'s risk assessment (Whitfield et al., 1996) indicates that at this level for healthy individuals (adults and children) at moderate exertion: 1) approximately 30% are estimated to experience moderate or greater lung function impairment, 2) approximately 15% are estimated to experience large or greater lung function impairments, and 3) approximately 5% are estimated to experience moderate to severe respiratory symptoms (i.e., chest pain with deep inspiration and aggravated cough). ',
    SEVERE: ' When air quality is in this range, it is expected that there will be widespread effects among the general population and more serious effects in members of sensitive groups. EPA\'s risk assessment (Whitfield et al., 1996) indicates that at this level for healthy individuals (adults and children) at moderate exertion: 1) approximately 50% are estimated to experience moderate or greater lung function impairment, 2) approximately 20% are estimated to experience large or greater lung function impairments, and 3) approximately 10-15% are estimated to experience moderate to severe respiratory symptoms (i.e., chest pain with deep inspiration and aggravated cough). Individuals with asthma or other respiratory conditions will likely be more severely impacted than healthy individuals, leading some to increase medication usage and seek medical attention, including increased emergency room and clinic visits, and increased hospital admissions. ',
    HAZARDOUS: 'If air quality gets in this range, it will trigger health warnings of emergency conditions and there will be widespread coverage in the media. The AQI\'s levels of health concern correlate with pollutant-specific health and cautionary statements that suggest relatively simple measures people can take to reduce their exposure to air pollution'
};

const HOSPITAL_SEARCH_RADIUS_KM = 2000;

function getBgColorVal(value) {
    if (value > 400) {
      return 'rgba(255,0,0,0.2)'
    } else if (value > 300) {
      return 'rgba(255,77,0,0.2)';
    } else if (value > 200) {
      return 'rgba(255,113,0,0.2)';
    } else if (value > 100) {
      return 'rgba(255,183,0,0.2)';
    } else if (value > 50) {
      return 'rgba(233,255,0,0.2)';
    } else if (value <= 50 && value >= 0) {
      return 'rgba(0,255,50,0.2)';
    }
  }
  
  function getBorderColorVal(value) {
    if (value > 400) {
      return 'rgba(255,0,0,1)'
    } else if (value > 300) {
      return 'rgba(255,77,0,1)';
    } else if (value > 200) {
      return 'rgba(255,113,0,1)';
    } else if (value > 100) {
      return 'rgba(255,183,0,1)';
    } else if (value > 50) {
      return 'rgba(233,255,0,1)';
    } else if (value <= 50 && value >= 0) {
      return 'rgba(0,255,50,1)';
    }
  }
  
  function getSeverity(value) {
    if (value > 400) {
      return 'Hazardous'
    } else if (value > 300) {
      return 'Severe';
    } else if (value > 200) {
      return 'Unhealthy';
    } else if (value > 100) {
      return 'Poor';
    } else if (value > 50) {
      return 'Moderate';
    } else if (value <= 50 && value >= 0) {
      return 'Good';
    }
  }