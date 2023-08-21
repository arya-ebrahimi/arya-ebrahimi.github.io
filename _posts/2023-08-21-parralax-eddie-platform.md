---
layout: post
title: "Parallax Eddie Platform with ROS2"
author: arya
categories: [Robotics]
tags: [mobile-robot, slam]
image: /assets/img/eddie/obot.png
math: true
---
----
## Abstract
In this article, we provide a comprehensive report on how to get started with the Parallax Eddie robot platform with ROS2, and we discuss the problems we encountered during our study.

## Setting up the Kinect
In this section, we will begin by explaining how to utilize the Kinect sensor in ROS2. To start, you need to install the [kinect_ros2](https://github.com/fadlio/kinect_ros2) package, which offers RGB-D topics for ROS2. This package requires the installation of [libfreenect](https://github.com/OpenKinect/libfreenect), which is a userspace driver specifically designed for the Microsoft Kinect sensor.

### Problems
If you carefully adhere to the instructions provided in the kinect_ros2 readme and ensure that all dependencies of libfreenect are satisfied, you should not encounter any issues. You can build libfreenect by following the given set of instructions.

```bash
git clone https://github.com/OpenKinect/libfreenect
cd libfreenect
mkdir build && cd build
cmake .. -DBUILD_OPENNI2_DRIVER=ON\
        -DBUILD_EXAMPLES=ON\
        -DBUILD_PYTHON3=OFF\
make
sudo make install
```
Once you have installed libfreenect successfully, the building process of kinect_ros2 should be smooth and error-free. It will publish several topics, including image\_raw, camera\_info, depth/image\_raw, and depth/camera\_info. The outputs of the image\_raw and depth/image\_raw topics can be observed in Figure 1 using rviz2.

```bash
ros2 run kinect_ros2 kinect_ros2_node
```

<p>
  <img src="/assets/img/eddie/problem2.png" alt="drawing" width="800"/>
  <em> The result of the image\_raw and depth/image\_raw topics shown in rviz2. </em>
</p>

## Add timestamp to RGB images
After analyzing the topics in the kinect\_ros2 package, it was observed that the RGB topics were missing timestamps. Timestamps are essential for synchronizing data from various sensors and components in a robotic system. They ensure accurate correlation and fusion of data captured or processed by different modules.\\
\noindent
To address this issue, the timer callback in the kinect\_ros2\_component.cpp file has been modified to include timestamps for RGB images. This modification ensures that each RGB image is assigned a timestamp, enabling proper synchronization and temporal integration of the data within the robotic system.

```c++
void KinectRosComponent::timer_callback()
{
  freenect_process_events(fn_ctx_);
  auto header = std_msgs::msg::Header();

  auto stamp = now();
  header.stamp = stamp;
  depth_info_.header.stamp = stamp;
  rgb_info_.header.stamp = stamp;

  if (_depth_flag) {
    header.frame_id = "kinect_depth";
    auto msg = cv_bridge::CvImage(header, "16UC1", _depth_image).toImageMsg();
    depth_pub_.publish(*msg, depth_info_);

    _depth_flag = false;
  }

  if (_rgb_flag) {
    header.frame_id = "kinect_rgb";
    auto msg = cv_bridge::CvImage(header, "rgb8", _rgb_image).toImageMsg();
    rgb_pub_.publish(*msg, rgb_info_);

    _rgb_flag = false;
  }
}
```

<p>
  <img src="/assets/img/eddie/before_time.png" alt="drawing" width="600"/>
  <img src="/assets/img/eddie/after_time.png" alt="drawing" width="600"/>
  <em> image\_raw topic before and after of setting the timestamps. </em>
</p>

## Bringup the Robot
To proceed further, the subsequent action involves initiating the robot. Initially, retrieve the most recent iteration of the eddiebot-ros repository and ensure that all the required elements are installed by executing the provided commands below.

```bash
rosdep update
rosdep install -i from-path src --rosdistro humble -y
```
Then connect the USB port of the robot and grant permission to it. 

```bash
sudo chmod a+rw /dev/ttyUSB0
```

### eddiebot-bringup package
This package facilitates the conversion of higher-level instructions, provided via ROS2 topics, into lower-level instructions specifically designed for the eddiebot. The file eddie\_controller.cpp subscribes to the eddie/simple\_velocity topic, which contains both the linear and angular velocity information for the robot. Given that the eddiebot operates as a differential-drive system, it necessitates separate linear and angular velocities for each of its wheels. Therefore, the approach outlined in section 6 is implemented to generate distinct velocities for each wheel.

<p>
  <img src="/assets/img/eddie/3.png" alt="drawing" width="600"/>
  <em> The desired output of the eddiebot-bringup. </em>
</p>

Subsequently, using ROS2 services, these higher-level instructions are transmitted to their corresponding services defined in "eddie.cpp," enabling the creation of low-level instructions. These instructions are then sent to the eddiebot via a serialized connection.

This package can be executed using the launch file as follows:
```bash
ros2 launch eddiebot_bringup eddie.launch.yaml
```

### eddiebot-nav package
This package incorporates essential transformations, remappings, and modifications within its launch files to enable various localization and mapping functionalities. The primary launch file, "eddiebot.launch.py," must be executed subsequent to the completion of the eddiebot-bringup process.

```bash
ros2 launch eddiebot_nav eddiebot.launch.py
```
After completing the preceding steps, the eddiebot is prepared for movement, and navigation topics are being published to facilitate its operation. To verify the functionality of these topics, you can launch the "view\_model" launch file from the eddiebot-rviz package. By moving the robot, the model representation should correspondingly move as well (ensure that the "fixed\_frame" is set to "odom").

The pointcloud\_to\_laserscan package is employed to generate synthetic LaserScans. The point clouds are published on the "/points" topic, which can be visualized by adding the topic to RViz2 and configuring its Quality of Service (QoS) to "BestEffort". The simulated LaserScans, on the other hand, are published on the "/scan" topic. By analyzing the /scan topic, we can find the range and FOV which is described in the videos.



### teleop-twist-keyboard
The subsequent step involves installing [teleop-twist-keyboard](https://github.com/ros2/teleop_twist_keyboard), which provides a means to generate twist messages using the keyboard and publish them on a specific topic. Then, the eddiebot\_vel\_controller package converts these twist messages into SimpleVelocity messages, a prerequisite for the eddiebot-bringup package.

A potential issue may arise due to the absence of the catkin\_pkg package, which can be resolved by installing it using the provided command below:

```bash
sudo pip install -U catkin_pkg
```
Once the teleop\_twist\_keyboard package has been built successfully, you can execute it using the following code snippet:

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r /cmd_vel:=/eddie/cmd_vel
```

<p>
  <img src="/assets/img/eddie/3-2.png" alt="drawing" width="600"/> <img src="/assets/img/eddie/3-4.png" alt="drawing" width="600"/>
  <em> /points and /scan topics shown in RViz2. </em>
</p>

## Networking

Once you have connected both machines to the same network, such as a mobile hotspot, it is important to disable any VPN or proxies that might interfere with the connection. To ensure network availability, make sure that the ROS\_LOCALHOST\_ONLY parameter is set to zero and both machines have the same ROS\_DOMAIN\_ID.

```bash
export ROS_LOCALHOST_ONLY=0
export ROS_DOMAIN_ID=0 
```
After completing these steps, you should verify if both machines have the same IP range by running the following command:

```bash
hostname -I
```
If all the necessary steps have been followed and the IP ranges are correct, you can proceed to run a simple talker and listener using the demo\_nodes\_cpp package. The talker will publish a simple "Hello, world!" message, and the listener should receive and display it.

Once you have confirmed that the talker and listener are functioning properly, you can proceed to bring up the robot and launch the main navigation launch file on the main laptop. Ensure that all the necessary components and dependencies are properly set up for the robot.

On the teleop laptop, you can check the topics being published by the main laptop. Use the appropriate commands or tools to view the topics and their data. This will allow you to monitor the robot's navigation and observe the relevant topics from the teleop laptop.

## 2D SLAM
In the current setup, the SLAM\_Toolbox is utilized for mapping using the simulated LaserScans, while Nav2 is employed for navigation based on the created map. It is crucial to adjust the parameters of each package, as defined in the configs folder of the eddiebot-nav package, to ensure optimal performance.

For the SLAM\_Toolbox, one key component to consider is the range of the kinect sensor. Real LaserScans typically cover a larger and wider area, whereas the fake LaserScans are generated from a kinect depth sensor with a limited range. A suitable range for the kinect in this case could be 5 meters.

Regarding Nav2, an important parameter to tune is the frequency at which it publishes velocity commands to the robot. The default value specified in the velocity\_smoother is 20 Hz, which can be quite high. If the robot is not moving despite receiving instructions, it could be due to the excessively high publish rate. By reducing this value to 0.2 (indicating that the velocity is published every 5 seconds), Nav2 can effectively control the robot's movement.

Additional key values to consider in Nav2 are the minimum and maximum velocities and accelerations, which should be adjusted based on the specific requirements of the robot and its environment.

One potential issue to address is the discrepancy in topic names between the eddiebot-vel-controller package and Nav2. Currently, the package publishes on "/eddie/cmd\_vel," while Nav2 publishes on "/cmd\_vel" without any remapping. To resolve this, either the eddiebot-vel-controller package should publish on "/cmd\_vel" or Nav2 needs to be remapped to publish on "/eddie/cmd\_vel." This adjustment will ensure proper communication between the packages.
The commands of this part are as follows: (each on a separate terminal)

- SLAM
  
    ```bash
    ros2 launch eddiebot_bringup eddie.launch.yaml
    ros2 launch eddiebot_nav eddiebot.launch.py
	ros2 launch eddiebot_rviz view_robot.launch.py
	ros2 launch eddiebot_nav slam.launch.py
    ```
- Nav2
    ```bash
    ros2 launch eddiebot_bringup eddie.launch.yaml
	ros2 launch eddiebot_nav eddiebot.launch.py
	ros2 launch eddiebot_rviz view_robot.launch.py
	ros2 launch eddiebot_nav localization.launch.py world:="map.yaml"
	ros2 launch eddiebot_nav nav2.launch.py
    ```



<object data="/assets/img/eddie/main.pdf" type="application/pdf" width="850px" height="850px">
    <embed src="/assets/img/eddie/main.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="http://yoursite.com/the.pdf">Download PDF</a>.</p>
    </embed>
</object>

