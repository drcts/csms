package com.drcts.csms.adapter;import android.bluetooth.BluetoothDevice;import android.support.annotation.NonNull;import android.support.v7.widget.RecyclerView;import android.view.LayoutInflater;import android.view.View;import android.view.ViewGroup;import android.widget.TextView;import com.drcts.csms.R;import com.drcts.csms.bean.Device;import java.util.List;/** * 作用- * * @author zhangbin * @date 2019-07-02 */public class DeviceAdapter extends RecyclerView.Adapter<DeviceAdapter.ViewHolder> {	/**	 * 设备列表数据	 */	private List<Device> mDeviceList;	ItemClickListener mItemClickListener;	//第二步， 写一个公共的方法	public void setOnItemClickListener(ItemClickListener listener) {		this.mItemClickListener = listener;	}	public DeviceAdapter(List<Device> deviceList) {		mDeviceList = deviceList;	}	static class ViewHolder extends RecyclerView.ViewHolder {		TextView mDeviceName, mDeviceAddress, mDeviceStatus;		public ViewHolder(@NonNull View itemView) {			super(itemView);			mDeviceName = itemView.findViewById(R.id.tv_device_name);			mDeviceAddress = itemView.findViewById(R.id.tv_device_address);			mDeviceStatus = itemView.findViewById(R.id.tv_device_status);		}	}	@NonNull	@Override	public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {		View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.device_item, parent, false);		return new ViewHolder(view);	}	@Override	public void onBindViewHolder(@NonNull ViewHolder holder, final int position) {		Device device = mDeviceList.get(position);		holder.mDeviceName.setText(device.getDeviceName());		holder.mDeviceAddress.setText(device.getDeviceAddress());		if (device.getDeviceStatus() == BluetoothDevice.BOND_NONE) {			holder.mDeviceStatus.setText("페어링 해제됨");		}		if (device.getDeviceStatus() == BluetoothDevice.BOND_BONDED) {			holder.mDeviceStatus.setText("페어링됨");		}		if (device.getDeviceStatus() == 14) {			holder.mDeviceStatus.setText("연결됨");		}		holder.itemView.setOnClickListener(new View.OnClickListener() {			@Override			public void onClick(View v) {				if (mItemClickListener != null) {					mItemClickListener.onItemClick(position);				}			}		});	}	@Override	public int getItemCount() {		return mDeviceList != null ? mDeviceList.size() : 0;	}	public interface ItemClickListener{		public void onItemClick(int position) ;	}}