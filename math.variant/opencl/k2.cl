#define GRID_SIZE 9

__inline uchar p_val(uchar * local_grid){
  uchar out = (local_grid[0] & 0x01) +
              (local_grid[1] & 0x01) +
              (local_grid[2] & 0x01) +
              (local_grid[3] & 0x01) +
              (local_grid[4] & 0x01) +
              (local_grid[5] & 0x01) +
              (local_grid[6] & 0x01) +
              (local_grid[7] & 0x01);
  return out;
}

__inline uchar q_val(uchar * local_grid){
  uchar out = (uchar)(((local_grid[0] ^ local_grid[1]) & 0x01) +
                      ((local_grid[1] ^ local_grid[2]) & 0x01) +
                      ((local_grid[2] ^ local_grid[3]) & 0x01) +
                      ((local_grid[3] ^ local_grid[4]) & 0x01) +
                      ((local_grid[4] ^ local_grid[5]) & 0x01) +
                      ((local_grid[5] ^ local_grid[6]) & 0x01) +
                      ((local_grid[6] ^ local_grid[7]) & 0x01) +
                      ((local_grid[7] ^ local_grid[0]) & 0x01));
  return (uchar)(out >> 1);
}

__inline uchar rh_val(uchar * local_grid){
  uchar out = (local_grid[0] & 0x01) +
              (local_grid[1] & 0x01) +
              (local_grid[2] & 0x01) -
              (local_grid[4] & 0x01) -
              (local_grid[5] & 0x01) -
              (local_grid[6] & 0x01);
  return out;
}

__inline uchar rv_val(uchar * local_grid){
  uchar out = (local_grid[0] & 0x01) +
              (local_grid[6] & 0x01) +
              (local_grid[7] & 0x01) -
              (local_grid[2] & 0x01) -
              (local_grid[3] & 0x01) -
              (local_grid[4] & 0x01);
  return out;
}

__inline void fill_grid(uchar * local_grid,
                        __global const uchar * input,
                        int i,
                        int width){
  local_grid[0] = input[i-width-1];
  local_grid[1] = input[i-width];
  local_grid[2] = input[i-width+1];
  local_grid[3] = input[i+1];
  local_grid[4] = input[i+width+1];
  local_grid[5] = input[i+width];
  local_grid[6] = input[i+width-1];
  local_grid[7] = input[i-1];
  local_grid[8] = input[i];
}

__inline uchar k2_code(uchar * local_grid){
  uchar x, p, q, output;
  
  x = local_grid[8] & 0x01;
  p  =  p_val(local_grid);
  q  =  q_val(local_grid);
  output = (q | (p << 3) | (x << 7));
  return output;
}

__inline uchar k2_phase(uchar * local_grid){
  uchar rh, rv, output;
  
  rh = rh_val(local_grid) + 3;
  rv = rv_val(local_grid) + 3;
  output =  (rh << 0) | (rv << 3);
  return output;
}

__inline void k2_threshold(uchar * local_grid,
                           uchar * local_grid_binary,
                           uchar beta,
                           uchar delta){
  // Local Params
  uchar local_grid_max = local_grid[0];
  uchar local_grid_min = local_grid[0];
  int local_grid_average = local_grid[0];
  uchar local_grid_diff;
  
  // Calculate Average
  for (int i = 1; i < GRID_SIZE; i++) {
    local_grid_average += local_grid[i];
    if (local_grid[i] < local_grid_min) {
      local_grid_min = local_grid[i];
    }
    if (local_grid[i] > local_grid_max) {
      local_grid_max = local_grid[i];
    }
  }
  local_grid_average = local_grid_average / 9;
  local_grid_diff = local_grid_max - local_grid_min;
  
  // Setup Flags
  bool delta_flag = local_grid_diff > delta;
  bool beta_flag = local_grid_average > beta;
  
  // Populate Output
  if (delta_flag) {
    uchar local_grid_compare = local_grid_diff / 2 + local_grid_min;
    for(int i = 0; i < GRID_SIZE; i++){
      local_grid_binary[i] = (local_grid[i] > local_grid_compare) ? 1 : 0;
    }
  }
  else if (beta_flag) {
    for (int i = 0; i < GRID_SIZE; i++) local_grid_binary[i] = 1;
  }
  else {
    for(int i = 0; i < GRID_SIZE; i++) local_grid_binary[i] = 0;
  }
}


__kernel void k2_binary(__global const uchar * src,
                        __global uchar * dst,
                        __global uchar * phase,
                        int cols, 
                        int rows){
  int x = get_global_id(0);
  int y = get_global_id(1);
  uchar local_grid[GRID_SIZE];
  if (x < cols && y < rows)
  {
    int i = y * cols + x;
    if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1){
      fill_grid(local_grid, src, i, cols);
      dst[i] = k2_code(local_grid);
      phase[i] = k2_phase(local_grid);
    }
    else {
      dst[i] = 0;
      phase[i] = 27;
    }
  }
}

__kernel void k2_gray(__global const uchar * src,
                      __global uchar * dst,
                      __global uchar * phase,
                      int cols,
                      int rows, 
                      uchar beta, 
                      uchar delta){
  int x = get_global_id(0);
  int y = get_global_id(1);
  uchar local_grid[GRID_SIZE];
  uchar local_grid_binary[GRID_SIZE];
  if (x < cols && y < rows)
  {
    int i = y * cols + x;
    if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1){
      fill_grid(local_grid, src, i, cols);
      k2_threshold(local_grid, local_grid_binary, beta, delta);
      dst[i] = k2_code(local_grid_binary);
      phase[i] = k2_phase(local_grid_binary);
    }
    else {
      dst[i] = 0;
      phase[i] = 27;
    }
  }
}