
x_0 = [0;0]; % initial 

function xdot = f_cust(x, t)
  [A B C] = modelization();
  u = 12;
  xdot = A * x + B * u;
endfunction

%% Simulations

X=lsode("f_cust", x_0,(t=linspace(0,1,50)'));
figure (1);
plot(t, X(:, 2)); %speed


