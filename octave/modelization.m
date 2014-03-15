%% System modelization
function [A B C] = modelization()
  
  % Constants
  k_moteur        = 5e-3;
  r_moteur        = 5;
  r_frottements   = 2.5e-1;
  r_poulie        = 5e-2; 
  m_chariot       = 5e-2;

  % Dynamics
  a = -1 / m_chariot * (k_moteur^2 / (r_poulie^2*r_moteur) + r_frottements);
  A = [0, 1; 0, a];

  b = k_moteur / (r_moteur * r_poulie * m_chariot);
  B = [0; b];

  C = [1 0];

end
