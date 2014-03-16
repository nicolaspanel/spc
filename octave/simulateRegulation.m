
x_0 = [0.5;0]; % initial 


function xdot = f_cust(x, t)
  [A B C] = modelization();
  expected_x  = [0; 0];
  %u = findK([-5+0i -5+0i]) * (expected_x - x);
  u = [50    10] * (expected_x - x);
  if (u > 12)
    u = 12;
  end
  if (u < -12)
    u = -12;
  end
  xdot = A * x + B * u;
endfunction

%% Simulations

X=lsode("f_cust", x_0,(t=linspace(0,3,20)'));
figure (1);
plot(t, X(:, 2), t, X(:, 1)); %speed / position
xlabel ("t");
ylabel ("speed / position");